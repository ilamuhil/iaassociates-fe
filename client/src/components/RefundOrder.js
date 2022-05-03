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
	Stack,
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
		toast.promise(
			axiosPvt.put(`/orders/refund/${orderId}`, {
				speed: optimumSpeed ? 'normal' : 'optimum',
				refundAmt,
				receiptNumber,
			}),
			{
				pending: 'Processing refund request...',
				error: 'error processing refund request',
				success: 'Successfully placed refund request',
			}
		);
	};
	return (
		<>
			<Stack direction='column' justifyContent='center' spacing={2} mx='auto'>
				<h5 className='w-100 my-4 text-black'>Refund Order</h5>
				<Grid item sx={{ mt: 4 }}>
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
				<Grid item>
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
				<Grid item>
					<TextField
						fullWidth
						variant='standard'
						label='Refund Amount'
						size='small'
						type='Number'
						value={refundAmt}
						onChange={e => {
							setRefundAmt(Number(e.target.value));
						}}
						helperText='You can leave blank to refund full amount'
					/>
				</Grid>
				<Grid item>
					<TextField
						fullWidth
						variant='standard'
						value={receiptNumber}
						label='Refund Receipt Id'
						size='small'
						onChange={e => {
							setReceiptNumber(e.target.value);
						}}
						helperText='For personal reference available on razorpay dashboard (optional &amp; upto 40 char)'
					/>
				</Grid>
				<Grid item>
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
			</Stack>
		</>
	);
};

export default RefundOrder;
