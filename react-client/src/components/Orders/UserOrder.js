import { useEffect, useState, useContext, useCallback } from 'react';
import {
	Paper,
	Grid,
	Button,
	Chip,
	SvgIcon,
	Box,
	Backdrop,
	CircularProgress,
} from '@mui/material';
import { ReactComponent as CashIcon } from '../../img/cash.svg';
import { ReactComponent as PaymentMethodSvgrepoComIcon } from '../../img/payment-method-svgrepo-com.svg';
import { ReactComponent as PackageDeliveredIcon } from '../../img/package-delivered.svg';
import { ReactComponent as PackageDeliveredStatusTimeIcon } from '../../img/package-delivered-status-time.svg';
import EmailIcon from '@mui/icons-material/Email';
import RefreshIcon from '@mui/icons-material/Refresh';
import { ReactComponent as ParcelBoxPackageIcon } from '../../img/parcel-box-package.svg';
import { ReactComponent as ProductPackageReturnIcon } from '../../img/product-package-return.svg';
import DoneIcon from '@mui/icons-material/Done';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthProvider';
import { format } from 'date-fns';
import { toast } from 'react-toastify';

const PackageIcon = ({ type }) => {
	if (type === 'completed') {
		return <PackageDeliveredIcon />;
	} else if (type === 'failed' || type === 'refunded') {
		return <ProductPackageReturnIcon />;
	} else if (type === 'created') {
		return <ParcelBoxPackageIcon />;
	} else {
		return <PackageDeliveredStatusTimeIcon />;
	}
};

function UserOrder() {
	const [ordersData, setOrdersData] = useState([]);
	const authctx = useContext(AuthContext);
	const [isLoading, setLoading] = useState(true);
	const axiosPvt = authctx.useAxiosPrivate();
	const [refundData, setRefundData] = useState({});
	const navigate = useNavigate();
	useEffect(() => {
		loadScript('https://checkout.razorpay.com/v1/checkout.js');
	}, []);
	useEffect(() => {
		const controller = new AbortController();
		axiosPvt
			.get('/orders/getorders', { signal: controller.signal })
			.then(res => {
				setOrdersData([...res.data]);
			});
		setTimeout(() => {
			setLoading(false);
		}, 4000);
		return () => {
			controller.abort();
		};
	}, [axiosPvt]);
	const loadScript = src => {
		return new Promise(resolve => {
			const script = document.createElement('script');
			script.src = src;
			script.onload = () => {
				resolve(true);
			};
			script.onerror = () => {
				resolve(false);
			};
			document.body.appendChild(script);
		});
	};

	const loadPaymentWindow = useCallback(
		(id, razorpayId = '') => {
			console.log('loadPayment executed', id);
			let order = ordersData.filter(order => order.id === id)[0];
			if (!razorpayId) razorpayId = order.razorpayId;
			let options = {
				key: 'rzp_test_V00iJCr4eSlZur',
				amount: order.value * 100,
				currency: 'INR',
				name: order.username,
				description: order.orderDescription,
				order_id: razorpayId,
				handler: function (response) {
					setLoading(true);
					axiosPvt
						.post(`/payments/verification/${order.id}`, {
							orderCreationId: razorpayId,
							razorpayPaymentId: response.razorpay_payment_id,
							razorpayOrderId: response.razorpay_order_id,
							razorpaySignature: response.razorpay_signature,
						})
						.then(({ data }) => {
							setLoading(false);
							navigate('/dashboard/payment/success/' + order.id, {});
						})
						.catch(e => {
							console.log(e);
							axiosPvt
								.post('/orders/set-order-failed', { id })
								.then(() => {
									navigate('/dashboard/payment/failed/' + order.id);
									setLoading(false);
								})
								.catch(e => {
									console.log(e);
									navigate('/dashboard/payment/failed/' + order.id);
									setLoading(false);
								});
						});
				},
				prefill: {
					name: order.username,
					email: order.email,
				},
				notes: {
					address: `${order.adl1} ${order.adl2}`,
				},
				theme: {
					color: '#3399cc',
				},
			};

			const paymentObject = new window.Razorpay(options);
			paymentObject.open();
			console.log('window executed');
		},
		[axiosPvt, navigate, ordersData]
	);

	const exec = orderStatus => {
		return orderStatus === 'refunded'
			? fetchRefundStatus
			: orderStatus === 'failed'
			? retryPayment
			: orderStatus === 'created'
			? loadPaymentWindow
			: orderStatus === 'pending' || orderStatus === 'onhold'
			? contactDialog
			: () => {};
	};

	const contactDialog = useCallback(
		id => {
			navigate('/dashboard/contact', { state: { id } });
		},
		[navigate]
	);

	const retryPayment = useCallback(
		async id => {
			try {
				let res = await axiosPvt.post('/payments/retry-payment', { id });
				toast.success('Order updated. Proceeding to payment...', {
					autoClose: 1000,
				});
				setTimeout(() => {
					loadPaymentWindow(id, res.razorpayId);
				}, 1500);
			} catch (e) {
				toast.error('could not update order,try again later');
			}
		},

		[axiosPvt, loadPaymentWindow]
	);

	const fetchRefundStatus = useCallback(
		async id => {
			const toastid = toast.loading(
				'Connecting to gateway, do not refresh the page...'
			);
			try {
				let data = await axiosPvt.get(
					`/payments/get-payment-refund-status/${id}`
				);

				setRefundData(prev => ({ ...prev, ...data.data }));
				toast.update(toastid, {
					render: 'fetched data from gateway servers',
					type: 'success',
					isLoading: false,
					autoClose: 500,
				});
			} catch (error) {
				toast.update(toastid, {
					render: 'Error: Could not connect to the gateway server',
					type: 'error',
					isLoading: false,
					autoClose: 500,
				});
			}
		},
		[axiosPvt]
	);

	const color = status => {
		status = status?.toLowerCase();
		if (status === 'completed') {
			return 'green';
		} else if (status === 'pending' || status === 'onhold') {
			return '#fcc425';
		} else if (status === 'failed' || status === 'refunded') {
			return '#d23030';
		} else if (status === 'created') {
			return '#aecad6';
		} else return '#039be5';
	};

	return ordersData.length !== 0 && isLoading === false ? (
		ordersData.map(order => (
			<Grid container key={`${order.id}`}>
				<Grid
					item
					component={Paper}
					style={{
						backgroundImage:
							'linear-gradient(315deg,  #e7eff9 0%,  #cfd6e6 74%)',
					}}
					mb={2}
					p={4}
					xs={12}
					md={10}
					lg={6}>
					<div className='row mb-2'>
						<div className='col'>
							<SvgIcon fontSize='large' titleAccess={order.orderStatus}>
								<PackageIcon type={order.orderStatus} />
							</SvgIcon>
						</div>
					</div>
					<div className='row justify-content-center'>
						<div className='col'>
							<small>
								<b>Service</b> : {order.title}
							</small>
						</div>
						<div className='col'>
							<h6 className='text-danger'>
								Order :{' '}
								<small>
									<i>
										(#{order.id} - ₹{order.value}){' '}
										{format(new Date(order.createdAt), 'dd MMM yyyy')}
									</i>
								</small>
							</h6>
						</div>
					</div>
					<div className='row gy-4 '>
						<div className='col-md-6 order-1 order-md-0'>
							<div className='row mb-2'>
								<div className='col'>
									<small>
										<b>Description</b>
									</small>
									:{' '}
									<small>
										<i>{order.orderDescription}</i>
									</small>
								</div>
							</div>
							<div className='row mb-2'>
								<div className='col'>
									<small className='mr-2'>
										<b>Order Status </b>:
									</small>
									<Chip
										color='success'
										label={order.orderStatus}
										size='small'
										sx={{ backgroundColor: color(order.orderStatus), mx: 1 }}
									/>
								</div>
							</div>
							<div className='row mb-2'>
								<div className='col'>
									{order.orderStatus === 'completed' ? (
										<Chip
											color='success'
											label='Order Completed'
											icon={<DoneIcon />}
										/>
									) : (
										<OrderActionButton
											orderStatus={order.orderStatus}
											exec={exec}
											id={order.id}
										/>
									)}
								</div>
							</div>
							{order.paymentStatus &&
								order.orderStatus !== 'refunded' &&
								order.orderStatus !== 'failed' && (
									<div className='row mt-3'>
										<div className='col'>
											{order.invoiceDate <= Date.now() && (
												<Button
													startIcon={<RemoveRedEyeIcon />}
													component={Link}
													to={`/dashboard/invoice/${order.id}`}
													sx={{
														'&:hover': {
															color: 'white',
															backgroundColor: 'black',
														},
														borderRadius: 0,
													}}
													variant='outlined'
													size='small'>
													View Invoice
												</Button>
											)}
										</div>
									</div>
								)}
						</div>
						<div
							className='col-md-6 order-0 order-md-1'
							style={{
								backgroundColor: '#E8E8E8',
								boxShadow: 'rgba(0, 0, 0, 0.06) 0px 2px 4px 0px inset',
								paddingBlock: '0.5rem',
								borderRadius: '5px',
								maxHeight: '250px',
								overflowY: 'scroll',
							}}>
							<h6>
								<i>Order Notes</i>
							</h6>
							<code
								style={{
									fontSize: '0.8rem',
									color: 'black',
								}}>
								{order.orderStatus === 'failed' &&
									'This order has failed. Click on the button below to update order and retry Payment'}
								{order.orderStatus === 'created' &&
									'In order to start the engagement process you can click on the button below and complete your payment'}
								{(order.orderStatus === 'pending' ||
									order.orderStatus === 'onhold') &&
									order.orderNotes}
								{order.orderStatus === 'refunded' &&
									Object.keys(refundData).length === 0 &&
									'Check Refund Status By clicking on the button below'}
								{order.orderStatus === 'refunded' &&
									Object.keys(refundData).length !== 0 && (
										<>
											<span>Current payment gateway refund status :</span>{' '}
											<Chip
												label={refundData.status}
												size='small'
												color='warning'
											/>
											<br />
											<span>Processing speed :</span>{' '}
											<Chip
												label={refundData.speed}
												color='info'
												size='small'
											/>
											<br />
											<span>Refund Amount :</span>{' '}
											<Chip
												label={refundData.amount + ' ₹'}
												color='success'
												size='small'
											/>
											<br />
										</>
									)}
							</code>
						</div>
					</div>
				</Grid>
				<Grid item md={6} lg={6}></Grid>
			</Grid>
		))
	) : ordersData.length === 0 && isLoading === false ? (
		<Paper sx={{ maxWidth: '400px' }}>
			<Box sx={{ padding: 4, textAlign: 'center' }}>
				<h4>No Orders Found</h4>
			</Box>
		</Paper>
	) : (
		<Backdrop
			sx={{
				color: '#fff',
				zIndex: theme => theme.zIndex.drawer + 1,
				backdropFilter: 'blur(20px)',
				transitionDuration: '3s',
			}}
			open={isLoading}>
			<CircularProgress color='inherit' />
		</Backdrop>
	);
}

const Buttonstyle = orderStatus => {
	let data;
	switch (orderStatus) {
		case 'refunded':
			data = {
				color: 'error',
				icon: (
					<SvgIcon>
						<PaymentMethodSvgrepoComIcon />
					</SvgIcon>
				),
				text: 'Get current refund status',
			};
			break;
		case 'pending':
			data = {
				color: 'info',
				icon: (
					<SvgIcon>
						<PaymentMethodSvgrepoComIcon />
					</SvgIcon>
				),
				text: 'Contact',
			};
			break;
		case 'onhold':
			data = { color: 'info', icon: <EmailIcon />, text: 'Respond' };
			break;
		case 'failed':
			data = {
				color: 'error',
				icon: <RefreshIcon />,
				text: 'Retry Payment',
			};
			break;
		default:
			data = {
				color: 'success',
				icon: (
					<SvgIcon>
						<CashIcon />
					</SvgIcon>
				),
				text: 'Pay Now',
			};
	}
	return data;
};

const OrderActionButton = ({ id, orderStatus, exec }) => {
	const style = Buttonstyle(orderStatus);
	return (
		<Button
			size='small'
			onClick={() => {
				exec(orderStatus)(id);
			}}
			sx={{ borderRadius: 0 }}
			variant='outlined'
			color={style.color}
			startIcon={style.icon}>
			{style.text}
		</Button>
	);
};

export default UserOrder;
