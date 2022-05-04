import AuthContext from '../../context/AuthProvider';
import { useState, useEffect, useContext } from 'react';
import LinkIcon from '@mui/icons-material/Link';
import {
	Grid,
	TextField,
	InputLabel,
	Select,
	MenuItem,
	Button,
	Box,
	ListSubheader,
	Stack,
	Checkbox,
	FormControlLabel,
} from '@mui/material';
import { toast } from 'react-toastify';
const PaymentLink = () => {
	const [usersList, setUsersList] = useState([]);
	const [user, setUser] = useState('');
	const [phone, setPhone] = useState('');
	const [amount, setAmount] = useState(0);
	const [upi_link, setUpi] = useState(false);
	const ctx = useContext(AuthContext);
	const axiosPvt = ctx.useAxiosPrivate();
	useEffect(() => {
		const controller = new AbortController();
		axiosPvt
			.get(
				'/user/multiple',
				{
					username: true,
					role: true,
					email: true,
				},
				{ signal: controller.signal }
			)
			.then(res => {
				let { data: users } = res;
				setUsersList(
					users
						.map(user => ({
							name: user.username,
							role: user.role,
							email: user.email,
						}))
						.sort((a, b) => {
							return a.name >= b.name ? 1 : -1;
						})
				);
				setUser(users[0].username);
			})
			.catch(e => {
				console.log(e);
			});
		return () => {
			controller.abort();
		};
	}, [axiosPvt]);

	const sendPaymentLink = () => {
		let email = usersList.filter(element => element.name === user)[0].email;
		toast.promise(
			axiosPvt.post('/orders/sendPaymentLink', {
				username: user,
				amount,
				email,
				phone,
				upi_link,
			}),
			{
				pending: 'Processing Request',
				success: `Payment link sent to ${user}`,
				error: 'payment link could not be sent try again later',
			}
		);
	};
	return (
		<>
			<Stack direction='column' justifyContent='center' spacing={2} mx='auto'>
				<h5 className='w-100 my-4 text-black'>
					Send Payment Link Without Creating An Order
				</h5>
				<Grid item>
					{usersList.length !== 0 && (
						<>
							<InputLabel id='select-user'>Select User</InputLabel>
							<Select
								fullWidth
								size='small'
								variant='standard'
								label='select User'
								labelId='select-user'
								onChange={e => {
									setUser(e.target.value);
								}}
								value={user}>
								<ListSubheader>User</ListSubheader>
								{usersList
									.filter(user => user.role === 'user')
									.map(member => (
										<MenuItem value={member.name} key={member.name}>
											{member.name}
										</MenuItem>
									))}
								<ListSubheader>Customer</ListSubheader>
								{usersList
									.filter(user => user.role === 'customer')
									.map(member => (
										<MenuItem value={member.name} key={member.name}>
											{member.name}
										</MenuItem>
									))}
							</Select>
						</>
					)}
				</Grid>
				<Grid item>
					<TextField
						fullWidth
						variant='standard'
						label='Amount'
						type='number'
						step='0.01'
						value={amount}
						onChange={e => {
							setAmount(e.target.value);
						}}
					/>
				</Grid>
				<Grid item>
					<TextField
						fullWidth
						variant='standard'
						label='Phone Number'
						helperText='Set phone number of user if you want to send sms notification. Leave blank otherwise Do not add (+91) prefix'
						value={phone}
						onChange={e => {
							setPhone(e.target.value);
						}}
					/>
				</Grid>
				<Grid item>
					<Box
						sx={{
							justifyContent: 'start',
							flexDirection: 'column',
							display: 'flex',
							mt: 2,
						}}>
						<FormControlLabel
							value='end'
							control={
								<Checkbox
									onChange={e => {
										setUpi(e.target.checked);
									}}
								/>
							}
							label='Send Upi link'
							labelPlacement='end'
						/>
						<small style={{ display: 'flex' }}>
							Leave blank for standard payment links
						</small>
					</Box>
				</Grid>
				<Grid item>
					<Box
						sx={{
							justifyContent: 'start',
							display: 'flex',
							mt: 2,
						}}>
						<Button
							onClick={sendPaymentLink}
							variant='contained'
							color='success'
							startIcon={<LinkIcon />}>
							Send Link
						</Button>
					</Box>
				</Grid>
			</Stack>
		</>
	);
};
export default PaymentLink;
