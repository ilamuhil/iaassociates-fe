import {
	Grid,
	TextField,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	Button,
	SvgIcon,
	Box,
	ListSubheader,
	Stack,
	Card,
	CardContent,
	TableRow,
	TableCell,
	Table,
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { ReactComponent as PrinterPrintSvgrepoComIcon } from './../../img/printer-print-svgrepo-com.svg';
import useMq from '../../hooks/useWindowResize';
import { useState, useEffect, useCallback, useContext } from 'react';
import axios from '../../api/axios';
import { toast } from 'react-toastify';
import AuthContext from '../../context/AuthProvider';
import usePricingCalculator from '../../hooks/usePricingCalculator';
const NewOrder = () => {
	let authctx = useContext(AuthContext);
	const axiosPvt = authctx.useAxiosPrivate();
	const [usersList, setUsersList] = useState([]);
	const [user, setUser] = useState('');
	const [orderDesc, setOrderDesc] = useState('');
	const [orderNotes, setOrderNotes] = useState('');
	const [invoiceDate, setInvoiceDate] = useState(Date.now());
	const [discount, setDiscount] = useState('');
	const [value, setValue] = useState(0);
	const [serviceList, setServices] = useState([]);
	const [selectedService, setSelectedService] = useState(0);
	const [invoiceNumber, setInvoiceNumber] = useState('');
	const price = usePricingCalculator(value, discount);
	const lgscr = useMq('lg');

	useEffect(() => {
		const controller = new AbortController();
		axiosPvt
			.get(
				'/user/multiple',
				{
					username: true,
					role: true,
					email: true,
					address: true,
				},
				{ signal: controller.signal }
			)
			.then(res => {
				let { data: users } = res;
				let filtered = users.filter(
					user =>
						(user.address !== null || user.address !== undefined) &&
						user.role !== 'admin'
				);
				setUsersList(
					filtered
						.map(user => ({
							name: user.username,
							role: user.role,
						}))
						.sort((a, b) => {
							return a.name >= b.name ? 1 : -1;
						})
				);
				setUser(filtered[0].username);
			})
			.catch(e => {
				console.log(e);
			});
		axios
			.get('/services/get-services', { signal: controller.signal })
			.then(res => {
				let { data: services } = res;
				setServices(
					services.map(service => ({ title: service.title, id: service.id }))
				);
			})
			.catch(e => {
				console.log(e);
			});
		return () => {
			controller.abort();
		};
	}, [axiosPvt]);

	const createOrder = useCallback(async () => {
		if (parseInt(discount) >= 100 || parseInt(discount) <= 0) {
			toast.warning('Invalid Discount value');
			return;
		}
		let { id } = serviceList.filter(
			service => service.title === selectedService
		)[0];
		toast.promise(
			axiosPvt.post('/orders/newOrder', {
				username: user,
				orderValue: parseFloat(value),
				discount: parseInt(discount),
				orderNotes,
				invoiceNumber,
				invoiceDate,
				orderDescription: orderDesc,
				serviceId: id,
			}),
			{
				pending: 'This may take a min...',
				success: `Order Created. ${user} can now view the order on his dashboard`,
				error: `An error occurred while creating your order`,
			}
		);
	}, [
		user,
		selectedService,
		value,
		discount,
		axiosPvt,
		serviceList,
		orderNotes,
		invoiceNumber,
		orderDesc,
		invoiceDate,
	]);
	return (
		<Stack direction='column' justifyContent='center' spacing={2} mx='auto'>
			<h5 className='w-100 my-4 text-black'>Create New Order</h5>
			<Grid item sx={{ mt: 4 }}>
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
						<small>Only users with an address are visible in this list</small>
					</>
				)}
			</Grid>
			<Grid item>
				{serviceList.length !== 0 && (
					<>
						<InputLabel id='select-service'>Select Service</InputLabel>
						<Select
							fullWidth
							size='small'
							variant='standard'
							label='Select Service'
							labelId='select-service'
							onChange={e => {
								setSelectedService(e.target.value);
							}}
							value={selectedService}>
							{serviceList.map(service => (
								<MenuItem value={service.title} key={service.title}>
									{service.title}
								</MenuItem>
							))}
						</Select>
					</>
				)}
			</Grid>
			<Grid item>
				<TextField
					fullWidth
					step='0.01'
					variant='standard'
					label='Order Value (₹)'
					type='Number'
					helperText='Inclusive of tax and discount'
					required
					value={value}
					onChange={e => {
						setValue(e.target.value);
					}}
				/>
			</Grid>

			<Grid item>
				<TextField
					fullWidth
					variant='standard'
					label='Discount %'
					type='number'
					max={100}
					helperText='Your order value is inclusive of your discount percentage. Leave blank as is if not applicable'
					value={discount}
					onChange={e => {
						setDiscount(e.target.value);
					}}
				/>
			</Grid>
			
			<Grid item>
				<TextField
					fullWidth
					variant='standard'
					label='Order Description'
					type='text'
					value={orderDesc}
					onChange={e => {
						setOrderDesc(e.target.value);
					}}
					helperText='This will be visible on your invoice'
					required
				/>
			</Grid>
			<Grid item>
				<TextField
					fullWidth
					variant='standard'
					label='Invoice Number'
					type='text'
					value={invoiceNumber}
					onChange={e => {
						setInvoiceNumber(e.target.value);
					}}
					required
				/>
			</Grid>
			<Grid item>
				<TextField
					fullWidth
					variant='standard'
					label='Order Notes'
					type='text'
					multiline
					maxRows={4}
					value={orderNotes}
					onChange={e => {
						setOrderNotes(e.target.value);
					}}
					helperText='This is will be visible on user dashboard'
					required
				/>
			</Grid>
			<Grid item>
				<Box
					sx={{
						justifyContent: 'start',
						display: 'flex',
						mt: lgscr ? '0.4rem' : '0px',
					}}>
					<FormControl sx={{ marginTop: 1 }}>
						<LocalizationProvider dateAdapter={AdapterDateFns}>
							<DatePicker
								minDate={Date.now()}
								value={invoiceDate}
								onChange={newValue => {
									setInvoiceDate(newValue);
								}}
								InputProps={{ placeholder: 'fuck you' }}
								renderInput={params => (
									<TextField
										fullWidth
										{...params}
										variant='standard'
										helperText='Pick a date on which Invoice should be made available for the user'
									/>
								)}
							/>
						</LocalizationProvider>
					</FormControl>
				</Box>
			</Grid>
			<Card sx={{ pt: 3, maxWidth: '300px' }}>
				<h5 className='text-center'>Pricing Breakdown</h5>
				<CardContent>
					<Table size='small'>
						<TableRow>
							<TableCell>
								<b>Base Price : </b>
							</TableCell>
							<TableCell sx={{ textAlign: 'end' }}>
								{price.basePrice} ₹
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell>
								<b>Discount Price : </b>
							</TableCell>
							<TableCell sx={{ textAlign: 'end' }}>
								{price.discountValue} ₹
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell>
								<b>Taxable Value : </b>
							</TableCell>
							<TableCell sx={{ textAlign: 'end' }}>
								{price.taxableValue} ₹
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell>
								<b>Tax (18%) : </b>
							</TableCell>
							<TableCell sx={{ textAlign: 'end' }}>
								{price.taxValue} ₹
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell>
								<b>Total value : </b>
							</TableCell>
							<TableCell sx={{ textAlign: 'end' }}>{value} ₹</TableCell>
						</TableRow>
					</Table>
				</CardContent>
			</Card>

			<Grid item>
				<Box
					sx={{
						justifyContent: 'start',
						display: 'flex',
						mt: 2,
					}}>
					<Button
						onClick={() => {
							createOrder();
						}}
						variant='contained'
						color='success'
						startIcon={
							<SvgIcon>
								<PrinterPrintSvgrepoComIcon />
							</SvgIcon>
						}>
						Create Order
					</Button>
				</Box>
			</Grid>
			
		</Stack>
	);
};

export default NewOrder;
