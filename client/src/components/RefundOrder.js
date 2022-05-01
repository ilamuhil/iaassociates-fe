import { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { ReactComponent as UpdateIcon } from './../img/update-7.svg';
import SvgIcon from '@mui/material/SvgIcon';
import AuthContext from '../context/AuthProvider';
import useMq from './../hooks/useWindowResize';
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
	Box,
} from '@mui/material';
import { v4 as uuid } from 'uuid';
const RefundOrder = () => {
	const [orderId, setOrderId] = useState(0);
	const lgscr = useMq('lg');
	const ctx = useContext(AuthContext);
	const [orderIdList, setOrderIdList] = useState([]);
	const axiosPvt = ctx.useAxiosPrivate();
	const [refundAmt, setRefundAmt] = useState(0);
	const [optimumSpeed, setOptimumSpeed] = useState(false);
	const [receiptNumber, setReceiptNumber] = useState('');
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

	const refundOrder = async () => {
		const id = toast.loading('Processing refund request');
		try {
			let response = await axiosPvt.put(`/refund/${orderId}`, {
				speed: optimumSpeed ? 'normal' : 'optimum',
				refundAmt,
				receiptNumber,
			});
			toast.update(id, {
				render: `Refund of amount ${response.data.refund_amt} has sent for processing successfully!`,
				type: 'success',
				isLoading: false,
			});
		} catch (error) {
			console.error(error);
			toast.update(id, {
				render: `Error : Bad Gateway`,
				type: 'error',
				isLoading: false,
				autoClose: 2000,
			});
		}
	};
	return (
		<>
			<Grid item sm={12} md={6} lg={4} xl={3}>
				<FormControl variant='standard' fullWidth>
					<InputLabel id='order-status'>Order Id</InputLabel>
					{orderIdList.length !== 0 && (
						<Select
							labelId='Select OrderId'
							id='orderStatus'
							value={orderId}
							onChange={e => {
								setOrderId(e.target.value);
							}}
							label='Order Status'>
							{orderIdList.map(order => (
								<MenuItem key={uuid} value={order.id}>
									{order.id}
								</MenuItem>
							))}
						</Select>
					)}
				</FormControl>
			</Grid>
			<Grid item sm={12} md={6} lg={4} xl={3}>
				<Box
					sx={{
						justifyContent: 'start',
						display: 'flex',
						flexDirection: 'column',
					}}>
					<FormControlLabel
						label='Enable Instant refund'
						control={
							<Checkbox
								checked={optimumSpeed}
								onChange={() => {
									setOptimumSpeed(p => !p);
								}}
								inputProps={{ 'aria-label': 'controlled' }}
							/>
						}
					/>
					<small
						style={{
							fontSize: '10px',
							textAlign: 'start',
							display: 'inline-block',
						}}>
						<span
							style={{
								fontSize: '0.6rem',
								color: 'red',
								textAlign: 'start',
							}}>
							Instant refunds are chargeable by razorpay*
						</span>
						<br></br>
						Contact{' '}
						<a
							href='https://razorpay.com/support/#request'
							target='_blank'
							rel='noreferrer nofollow'>
							razorpay support
						</a>{' '}
						to know about their refund charges
					</small>
				</Box>
			</Grid>
			<Grid item sm={12} md={6} lg={4} xl={3}>
				<TextField
					fullWidth
					variant='standard'
					label='Refund Amount'
					size='small'
					type='Number'
					value={receiptNumber}
					onChange={e => {
						setRefundAmt(Number(e.target.value));
					}}
					helperText='You can leave blank to refund full amount'
				/>
			</Grid>
			<Grid item sm={12} md={6} lg={4} xl={3}>
				<TextField
					fullWidth
					variant='standard'
					label='Refund Receipt Number'
					size='small'
					type='Number'
					onChange={e => {
						setReceiptNumber(Number(e.target.value));
					}}
					helperText='For personal reference available on razorpay dashboard (optional &amp; upto 40 char)'
				/>
			</Grid>
			<Grid item sm={12} md={6} lg={4} xl={3}>
				<Box
					sx={{
						justifyContent: 'start',
						display: 'flex',
						mt: lgscr ? '0.4rem' : '0px',
					}}>
					<Button
						onClick={() => {
							refundOrder();
						}}
						variant='contained'
						sx={{ backgroundColor: 'red' }}
						startIcon={
							<SvgIcon>
								<UpdateIcon />
							</SvgIcon>
						}>
						Refund Order
					</Button>
				</Box>
			</Grid>
		</>
	);
};

export default RefundOrder;
