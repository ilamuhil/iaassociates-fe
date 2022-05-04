import {
	TableContainer,
	Table,
	TableBody,
	TableRow,
	TableHead,
	TableCell,
	Chip,
	ButtonBase,
	IconButton,
	Grow,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { useEffect, useState, useCallback, Fragment } from 'react';
import { v4 as uuid } from 'uuid';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

const OrdersTable = ({
	orders,
	setOpen,
	setOrderId,
	setSelectedUser,
	setDeleteOrder,
}) => {
	const [totalVal, setTotalValue] = useState(0);
	useEffect(() => {
		setTotalValue(
			orders
				.reduce((total, order) => total + parseFloat(order.value), 0)
				.toFixed(2)
		);
	}, [orders]);

	const statuscolor = useCallback(status => {
		status = status.toLowerCase();
		if (status === 'completed') {
			return '#7fff00';
		} else if (status === 'pending' || status === 'onHold') {
			return '#fcc425';
		} else if (status === 'failed' || status === 'refunded') {
			return '#d23030';
		} else if (status === 'created') {
			return '#aecad6';
		} else return '#039be5';
	}, []);
	return (
		<>
			<TableContainer>
				<Table>
					<TableHead>
						<Grow
							in={orders.length !== 0}
							style={{ transformOrigin: '0 0 0' }}
							{...(orders.length !== 0 ? { timeout: 1000 } : {})}>
							<TableRow>
								<TableCell>Order Id</TableCell>
								<TableCell>Order Date</TableCell>
								<TableCell>User</TableCell>
								<TableCell>Service</TableCell>
								<TableCell sx={{ textAlign: 'end' }}>Order Value</TableCell>
								<TableCell sx={{ textAlign: 'end' }}>Order Status</TableCell>
								<TableCell sx={{ textAlign: 'end' }}>Payment Status</TableCell>
								<TableCell sx={{ textAlign: 'end' }}>Order Actions</TableCell>
							</TableRow>
						</Grow>
					</TableHead>
					<TableBody>
						{orders.map((order, index) => (
							<Fragment key={uuid()}>
								<TableRow>
									<TableCell>{order.id}</TableCell>
									<TableCell>
										<small>
											{format(new Date(order.createdAt), 'E h:mmaaa')}
										</small>
										<br />
										{format(new Date(order.createdAt), 'do MMMM')}
									</TableCell>
									<TableCell>{order.username}</TableCell>
									<TableCell>{order.title}</TableCell>
									<TableCell sx={{ textAlign: 'end' }}>
										{new Intl.NumberFormat('en-IN', {
											style: 'currency',
											currency: 'INR',
										}).format(order.value)}{' '}
									</TableCell>
									<TableCell sx={{ textAlign: 'end' }}>
										<Chip
											label={order.orderStatus}
											style={{
												backgroundColor: `${statuscolor(order.orderStatus)}`,
											}}
											size='small'
										/>
									</TableCell>
									<TableCell sx={{ textAlign: 'end' }}>
										<ButtonBase
											onClick={() => {
												if (!order.paymentStatus) {
													setSelectedUser(order.email);
													setDeleteOrder(false);
													setOrderId(order.id);
													setOpen(true);
												} else {
													return;
												}
											}}
											sx={{
												borderRadius: '10px',
												boxShadow: order.paymentStatus
													? 'none'
													: 'rgba(0, 0, 0, 0.24) 0px 3px 8px',
											}}>
											<Chip
												label={order.paymentStatus ? 'Paid' : 'unpaid'}
												style={{
													backgroundColor: order.paymentStatus
														? `${statuscolor('completed')}`
														: `${statuscolor('failed')}`,
												}}
												size='small'
											/>
										</ButtonBase>
									</TableCell>
									<TableCell sx={{ textAlign: 'end' }}>
										<IconButton
											onClick={e => {
												setOrderId(order.id);
												setDeleteOrder(true);
												setOpen(true);
											}}
											size='small'
											sx={{
												backgroundColor: 'white',
												color: 'red',
												mx: 1,
												boxShadow: 2,
											}}>
											<DeleteIcon fontSize='10px' />
										</IconButton>
										<IconButton
											component={Link}
											to={`/dashboard/admin/invoice/${order.id}`}
											size='small'
											sx={{
												backgroundColor: 'white',
												color: '#07c6f8',
												mx: 1,
												boxShadow: 2,
											}}>
											<RemoveRedEyeIcon fontSize='10px' />
										</IconButton>
									</TableCell>
								</TableRow>
							</Fragment>
						))}

						<TableRow>
							<TableCell>
								<b style={{ color: '#1976d2' }}>Total Order Value</b>
							</TableCell>
							<TableCell>
								<b style={{ color: '#1976d2' }}>
									{new Intl.NumberFormat('en-IN', {
										style: 'currency',
										currency: 'INR',
									}).format(totalVal)}{' '}
									₹
								</b>
							</TableCell>
						</TableRow>
					</TableBody>
				</Table>
			</TableContainer>
		</>
	);
};
export default OrdersTable;
