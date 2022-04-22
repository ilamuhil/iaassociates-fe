import { useEffect, useState, useCallback, Fragment,useContext } from 'react';
import { Paper, Grid, Button, Chip, Typography, SvgIcon } from '@mui/material';
import { ReactComponent as CashIcon } from './../img/cash.svg';
import { ReactComponent as PackageDeliveredIcon } from './../img/package-delivered.svg';
import { ReactComponent as PackageDeliveredStatusTimeIcon } from './../img/package-delivered-status-time.svg';
import { ReactComponent as ParcelBoxPackageIcon } from './../img/parcel-box-package.svg';
import { ReactComponent as ProductPackageReturnIcon } from './../img/product-package-return.svg';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthProvider';
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
	const [ordersData, setOrdersData] = useState(null);
	const authctx = useContext(AuthContext);

	useEffect(() => {
		const axiosPvt = authctx.useAxiosPrivate();
		const controller = new AbortController();
		axiosPvt.get('/orders', { signal: controller.signal }).then(({ data }) => {
			setOrdersData(data);
		});
		return () => {
			controller.abort();
		};
	}, [authctx]);

	const color = useCallback(status => {
		status = status.toLowerCase();
		if (status === 'completed') {
			return 'green';
		} else if (status === 'pending' || status === 'onHold') {
			return '#fcc425';
		} else if (status === 'failed' || status === 'refunded') {
			return '#d23030';
		} else if (status === 'created') {
			return '#aecad6';
		} else return '#039be5';
	}, []);
	return (
		<Grid container>
			{ordersData &&
				ordersData.map(order => (
					<Fragment key={order.id}>
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
									<SvgIcon fontSize='large' titleAccess={order.status}>
										<PackageIcon type={order.status} style={{}} />
									</SvgIcon>
								</div>
							</div>
							<div className='row justify-content-center'>
								<div className='col'>
									<h6>Service Title : {order.service.title}</h6>
								</div>
								<div className='col'>
									<h6 className='text-danger'>(Order Number : #{order.id})</h6>
								</div>
							</div>
							<div className='row mb-2'>
								<div className='col'>
									<Typography variant='caption'>
										<b>Description</b> : {order.orderDescription}
									</Typography>
								</div>
							</div>
							<div className='row mb-2'>
								<div className='col'>
									<small className='mr-2'>
										<b>Order Status : </b>
									</small>
									<Chip
										color='success'
										label={order.status}
										size='small'
										sx={{ backgroundColor: color(order.status) }}
									/>
								</div>
							</div>

							<div className='row mb-2'>
								<div className='col'>
									{order.paymentStatus === 'unpaid' &&
									order.status !== 'refunded' &&
									order.status !== 'failed' ? (
										<Button
											variant='contained'
											size='small'
											startIcon={
												<SvgIcon>
													<CashIcon />
												</SvgIcon>
											}
											color='error'>
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
							{order.paymentStatus === 'paid' &&
								order.status !== 'refunded' &&
								order.status !== 'failed' && (
									<div className='row'>
										<div className='col'>
											<Button
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
						</Grid>
						<Grid item md={6} lg={6}></Grid>
					</Fragment>
				))}
		</Grid>
	);
}

export default UserOrder;
