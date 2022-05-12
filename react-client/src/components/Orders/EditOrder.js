import { useEffect, useState, useContext, useCallback } from 'react';
import AuthContext from '../../context/AuthProvider';
import { v4 as uuid } from 'uuid';
import { ReactComponent as UpdateIcon } from './../../img/update-7.svg';
import {
	Grid,
	InputLabel,
	FormControl,
	MenuItem,
	Select,
	FormControlLabel,
	Checkbox,
	TextField,
	Button,
	FormGroup,
	SvgIcon,
	Box,
	Stack,
} from '@mui/material';
import useMq from '../../hooks/useWindowResize';
import { toast } from 'react-toastify';
const EditOrder = () => {
	const [orderId, setOrderId] = useState(0);
	const [updatedOrderStatus, setUpdatedOrderStatus] = useState('pending');
	const [orderNotes, setOrderNotes] = useState('');
	const ctx = useContext(AuthContext);
	const [orderIdList, setOrderIdList] = useState([]);
	const [notifyUser, setNotifyUser] = useState(true);
	const axiosPvt = ctx.useAxiosPrivate();
	const xlscr = useMq('xl');
	const mdscr = useMq('md');
	const lgscr = useMq('lg');
	const updateOrder = useCallback(async () => {
		try {
			toast.promise(
				axiosPvt.put(`/orders/updateOrder/${orderId}`, {
					orderNotes,
					orderStatus: updatedOrderStatus,
				}),
				{
					pending: 'Updating your order...',
					success: notifyUser
						? 'Updated your order and notified User'
						: 'updated your order successfully',
					error: 'Could not Update your order',
				}
			);
		} catch (e) {}
	}, [axiosPvt, orderId, updatedOrderStatus, notifyUser, orderNotes]);
	useEffect(() => {
		const controller = new AbortController();
		axiosPvt
			.get('/orders/editable-orders', { controller: controller.signal })
			.then(({ data }) => {
				setOrderIdList(data); 
			})
			.catch(e => console.log(e));
		
		return () => {
			controller.abort();
		};
	}, [axiosPvt]);
	return (
		<Stack direction='column' justifyContent='center' spacing={2} mx='auto'>
			<h5 className='w-100 my-4 text-black'>Update Order</h5>
			<Grid item>
				<FormControl variant='standard' fullWidth>
					<InputLabel id='order-status'>Order Id</InputLabel>
					<Select
						labelId='Select OrderId'
						id='orderStatus'
						defaultValue={0}
						onChange={e => {
							setOrderId(e.target.value);
						}}
						label='Order Status'>
						{orderIdList.map(order => (
							<MenuItem key={uuid()} value={order.id}>
								{order.id}
							</MenuItem>
						))}
					</Select>
				</FormControl>
			</Grid>
			<Grid item>
				<FormControl variant='standard' fullWidth>
					<InputLabel id='update order status'>Order Id</InputLabel>
					<Select
						defaultValue='Update Order Status'
						labelId='update order status'
						id='update order status'
						value={updatedOrderStatus}
						onChange={e => {
							setUpdatedOrderStatus(e.target.value);
						}}
						label='update order status'>
						<MenuItem value='pending'>Processing</MenuItem>
						<MenuItem value='onhold'>On Hold</MenuItem>
					</Select>
				</FormControl>
			</Grid>
			<Grid item>
				<TextField
					fullWidth
					variant='standard'
					label='Order Notes'
					helperText='Only the last latest updated order note will be available to the user in dashboard'
					value={orderNotes}
					onChange={e => {
						setOrderNotes(e.target.value);
					}}
				/>
			</Grid>
			<Grid item>
				<FormGroup
					style={{
						marginTop: xlscr
							? '0.4rem'
							: mdscr
							? '1rem'
							: lgscr
							? '1rem'
							: '0px',
					}}>
					<FormControlLabel
						control={
							<Checkbox
								checked={notifyUser}
								onChange={e => {
									setNotifyUser(e.target.checked);
								}}
							/>
						}
						label='Notify user via email?'
					/>
				</FormGroup>
			</Grid>
			<Grid item>
				<Box sx={{ justifyContent: 'start', display: 'flex' }}>
					<Button
						onClick={updateOrder}
						variant='contained'
						color='warning'
						startIcon={
							<SvgIcon>
								<UpdateIcon />
							</SvgIcon>
						}>
						Edit Order
					</Button>
				</Box>
			</Grid>
		</Stack>
	);
};

export default EditOrder;
