import { useEffect, useState, useContext } from 'react';
import {
	Paper,
	Grid,
	Button,
	Chip,
	Typography,
	SvgIcon,
	Box,
} from '@mui/material';
import { ReactComponent as CashIcon } from './../img/cash.svg';
import { ReactComponent as PackageDeliveredIcon } from './../img/package-delivered.svg';
import { ReactComponent as PackageDeliveredStatusTimeIcon } from './../img/package-delivered-status-time.svg';
import { ReactComponent as ParcelBoxPackageIcon } from './../img/parcel-box-package.svg';
import { ReactComponent as ProductPackageReturnIcon } from './../img/product-package-return.svg';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthProvider';
import { format } from 'date-fns';
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
	const axiosPvt = authctx.useAxiosPrivate();
	const navigate = useNavigate();
	useEffect(() => {
		const controller = new AbortController();
		loadScript('https://checkout.razorpay.com/v1/checkout.js');
		axiosPvt
			.get('/orders/getorders', { signal: controller.signal })
			.then(res => {
				setOrdersData([...res.data]);
			});
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
	const loadPaymentWindow = id => {
		let order = ordersData.filter(order => order.id === id)[0];
		let options = {
			key: 'rzp_test_V00iJCr4eSlZur',
			amount: order.value * 100,
			currency: 'INR',
			name: order.username,
			description: order.orderDescription,
			order_id: order.razorpayId,
			handler: function (response) {
				axiosPvt
					.post(`/orders/payments/verification/${order.id}`, {
						orderCreationId: order.razorpayId,
						razorpayPaymentId: response.razorpay_payment_id,
						razorpayOrderId: response.razorpay_order_id,
						razorpaySignature: response.razorpay_signature,
					})
					.then(({ data }) => {
						navigate('/dashboard/payment/success/' + order.id, {});
					})
					.catch(e => {
						console.log(e);
						navigate('/dashboard/payment/failed/' + order.id);
					});
			},
			prefill: {
				name: order.username,
				email: order.email,
			},
			notes: {
				address: 'Razorpay Corporate Office',
			},
			theme: {
				color: '#3399cc',
			},
		};

		const paymentObject = new window.Razorpay(options);
		paymentObject.open();
	};
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
	return ordersData.length !== 0 ? (
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
							<h6>
								<b>Service</b> : {order.title}
							</h6>
						</div>
						<div className='col'>
							<h6 className='text-danger'>
								Order :{' '}
								<small>
									<i>
										(#{order.id}){' '}
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
									<b>Description</b> :{' '}
									<small>
										<i>{order.orderDescription}</i>
									</small>
								</div>
							</div>
							<div className='row mb-2'>
								<div className='col'>
									<small className='mr-2'>
										<b>Order Status : </b>
									</small>
									<Chip
										color='success'
										label={order.orderStatus}
										size='small'
										sx={{ backgroundColor: color(order.orderStatus) }}
									/>
								</div>
							</div>
							<div className='row mb-2'>
								<div className='col'>
									{!order.paymentStatus &&
									order.orderStatus !== 'refunded' &&
									order.orderStatus !== 'failed' ? (
										<Button
											variant='contained'
											size='small'
											onClick={() => {
												loadPaymentWindow(order.id);
											}}
											startIcon={
												<SvgIcon>
													<CashIcon />
												</SvgIcon>
											}
											color='success'>
											Pay now
										</Button>
									) : (
										<Chip
											label='Paid Order'
											sx={{ backgroundColor: 'green', color: 'white' }}
											size='small'
										/>
									)}
								</div>
							</div>
							{order.paymentStatus &&
								order.orderStatus !== 'refunded' &&
								order.orderStatus !== 'failed' && (
									<div className='row mt-3'>
										<div className='col'>
											<Button
												startIcon={<RemoveRedEyeIcon />}
												component={Link}
												to={`/invoices/:${order.id}`}
												sx={{
													'&:hover': {
														color: 'white',
														backgroundColor: 'black',
													},
												}}
												variant='contained'
												size='small'>
												View Invoice
											</Button>{' '}
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
							}}>
							<h6>Order Notes</h6>
							<code
								style={{
									fontSize: '0.8rem',
									lineHeight: '0.8rem',
									color: 'black',
								}}>
								{order.orderNotes}
							</code>
						</div>
					</div>
				</Grid>
				<Grid item md={6} lg={6}></Grid>
			</Grid>
		))
	) : (
		<Paper sx={{ maxWidth: '400px' }}>
			<Box sx={{ padding: 4, textAlign: 'center' }}>
				<h4>No Orders Found</h4>
			</Box>
		</Paper>
	);
}

export default UserOrder;
