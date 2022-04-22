import {
	Grid,
	TextField,
	FormGroup,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	FormControlLabel,
	Checkbox,
	Autocomplete,
	Button,
	Switch,
	Typography,
} from '@mui/material';
import { ReactComponent as PrinterPrintSvgrepoComIcon } from './../img/printer-print-svgrepo-com.svg';
import { ReactComponent as UpdateIcon } from './../img/update-7.svg';
import SvgIcon from '@mui/material/SvgIcon';
import React, { useState, useEffect, useCallback } from 'react';
import axios from './../api/axios';
import { toast } from 'react-toastify';

const CreateNewOrderForm = () => {
	// let authctx = useContext(AuthContext);
	// const axiosPvt = authctx.useAxiosPrivate();
	const [updateBilling, setUpdateBilling] = useState(false);
	const [editOrder, setEditOrder] = useState(true);
	const [orderId, setOrderId] = useState(0);
	const [refundAmt, setRefundAmt] = useState(0);
	const [usersList, setUsersList] = useState([]);
	const [orderStatus, setOrderStatus] = useState('created');
	const [user, setUser] = useState('');
	const [orderDesc, setOrderDesc] = useState('');
	const [fName, setFname] = useState('');
	const [lName, setLname] = useState('');
	const [adl1, setAdl1] = useState('');
	const [adl2, setAdl2] = useState('');
	const [city, setCity] = useState('');
	const [zipcode, setZipCode] = useState(0);
	const [state, setState] = useState('');
	const [discount, setDiscount] = useState(0);
	const [value, setValue] = useState(0);
	const [companyInvChecked, setCompanyInvChecked] = useState(true);
	const [serviceList, setServices] = useState([]);
	const [selectedService, setSelectedService] = useState('');
	const [phNo, setPhNo] = useState(0);
	const [paymentChecked, setPaymentChecked] = useState(false);
	const [email, setEmail] = useState('');
	const [orderIdList, setOrderIdList] = useState([]);
	const [paymentStatus, setPaymentStatus] = useState('');
	useEffect(() => {
		axios
			.get('/user')
			.then(res => {
				let { data: users } = res;
				setUsersList(
					users.map(user => ({ name: user.username, role: user.role }))
				);
			})
			.catch(e => {
				console.log(e);
			});
		axios
			.get('/services')
			.then(res => {
				let { data: services } = res;
				setServices(services.map(service => ({ label: service.title })));
			})
			.catch(e => {
				console.log(e);
			});
		axios
			.get('/orderCount/total')
			.then(({ data }) => {
				let count = Number(data.count);
				let array = [...Array(count).keys()];
				array = array.map(val => ({ name: `${val + 1}` }));
				console.table(array);
				setOrderIdList(array);
			})
			.catch(e => console.log(e));
	}, []);
	const refundOrder = async () => {
		const id = toast.loading('Processing refund request');
		try {
			let response = await axios.put(`/refund/${orderId}`, {
				orderStatus: 'refunded',
				refundAmt,
			});
			toast.update(id, {
				render: `Refund of amount ${response.data.refund_amt} has been successful!`,
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

	const createOrder = useCallback(async () => {
		const id = toast.loading('This may take a min...');
		try {
			let invoiceType = companyInvChecked ? 'personal' : 'company';
			let response = await axios.post('orders/newOrder', {
				fName,
				lName,
				adl1,
				phoneNo: phNo,
				adl2,
				state,
				zipcode,
				city,
				email,
				username: user,
				orderValue: value,
				discount,
				paymentChecked,
				selectedService,
				invoiceType,
			});
			if (paymentChecked && response.status === 200) {
				toast.update(id, {
					render: `Your order has been created and payment link has been sent to ${user}`,
					type: 'success',
					isLoading: false,
				});
			} else if (response.status === 200 && !paymentChecked) {
				toast.update(id, {
					render: `Your order has been created you can send payment link from the orders section anytime`,
					type: 'success',
					isLoading: false,
				});
			}
		} catch (e) {
			toast.update(id, {
				render: 'An error occurred while creating your order',
				type: 'error',
				isLoading: false,
			});
		}
	}, [
		user,
		fName,
		lName,
		phNo,
		adl1,
		adl2,
		city,
		state,
		zipcode,
		email,
		paymentChecked,
		selectedService,
		value,
		discount,
		companyInvChecked,
	]);
	const getUserData = useCallback(() => {
		if (user === '') {
			if (!editOrder) {
				toast.warn('Select a valid user');
				return;
			}
		} else if (orderId === 0 || !Boolean(Number(orderId))) {
			if (editOrder) {
				toast.warn('Select a valid orderId');
				return;
			}
		}
		let urlPath = `/order/${orderId}?address=true&servicetitle=true`;
		if (!editOrder) {
			urlPath = `/addresses/username/${user}`;
		}
		console.log(urlPath);
		axios
			.get(urlPath, {
				headers: { Accept: 'application/json' },
			})
			.then(res => {
				let { data } = res;
				if (data.invoiceType === 'company') {
					setCompanyInvChecked(true);
					setFname(data.companyName);
					setLname(data.gstin);
				} else {
					setCompanyInvChecked(true);
					setFname(data.first_name);
					setLname(data.last_name);
				}
				setEmail(data.email);
				setState(data.state);
				setAdl1(data.adl2);
				setAdl2(data.adl2);
				setZipCode(data.zipcode);
				setPhNo(data.phoneNo);
				setCity(data.city);
				if (urlPath.includes(`/orders/${orderId}`)) {
					console.log('Hi there');
					setValue(Number(data.value));
					setOrderStatus(data.orderStatus);
					setDiscount(data.discount);
					setOrderDesc(data.orderDescription);
					setPaymentStatus(data.paymentStatus);
				}
			})
			.catch(e => {
				console.log(e);
			});
	}, [user, editOrder, orderId]);
	const sort = () => {
		let x = [];
		return [
			...x,
			...usersList.filter(e => e.role === 'customer'),
			...usersList.filter(e => e.role === 'user'),
		];
	};
	return (
		<Grid container justifyContent='start' rowSpacing={2}>
			<Grid item xs={12}>
				<FormGroup>
					<FormControlLabel
						control={
							<Switch
								onChange={e => {
									setEditOrder(prevState => !prevState);
								}}
								color='warning'
								defaultChecked
							/>
						}
						label='Edit existing order'
					/>
				</FormGroup>
			</Grid>

			<Grid container item spacing={2}>
				<Grid item xs={12} sm={4} md={3}>
					<Button
						size='small'
						variant='contained'
						fullWidth
						onClick={() => {
							getUserData();
						}}>
						Auto Populate
					</Button>
				</Grid>
				<Grid item xs={12} sm={6} md={5}>
					<FormGroup>
						<FormControlLabel
							control={
								<Checkbox
									disabled={updateBilling ? false : true}
									value={companyInvChecked}
									checked={companyInvChecked}
									onChange={() => {
										setCompanyInvChecked(prev => !prev);
									}}
									inputProps={{ 'aria-label': 'controlled' }}
								/>
							}
							label='Company Invoice?'
						/>
					</FormGroup>
				</Grid>
			</Grid>
			<Grid container item spacing={2}>
				<Grid item xs={12} md={5} lg={4}>
					<TextField
						disabled={updateBilling ? false : true}
						fullWidth
						value={fName}
						variant='standard'
						label={companyInvChecked ? 'Company Name' : 'First Name'}
						type='text'
						required
						onChange={e => {
							setFname(e.target.value);
						}}
					/>
				</Grid>
				<Grid item xs={12} md={5} lg={4}>
					<TextField
						disabled={updateBilling ? false : true}
						fullWidth
						lg={6}
						variant='standard'
						value={lName}
						label={companyInvChecked ? 'GST Number' : 'Last Name'}
						type='text'
						required
						onChange={e => {
							setLname(e.target.value);
						}}
					/>
				</Grid>
			</Grid>

			<Grid item xs={12} md={10} lg={8}>
				<Autocomplete
					disabled={!updateBilling ? false : true}
					disablePortal
					id='combo-box-demo'
					options={serviceList}
					renderInput={params => (
						<TextField
							{...params}
							variant='standard'
							label='Service'
							onChange={e => setSelectedService(e.target.value)}
						/>
					)}
				/>
			</Grid>
			<Grid item container spacing={2}>
				<Grid item xs={12} md={5} lg={4}>
					<TextField
						disabled={updateBilling ? false : true}
						label='Contact Number'
						variant='standard'
						value={phNo}
						type='text'
						fullWidth
						onChange={e => {
							setPhNo(e.target.value);
						}}
					/>
				</Grid>
				<Grid item xs={12} md={5} lg={4}>
					<TextField
						disabled={updateBilling ? false : true}
						value={email}
						label='Email'
						variant='standard'
						type='email'
						fullWidth
						onChange={e => {
							setEmail(e.target.value);
						}}
					/>
				</Grid>
			</Grid>
			<Grid item xs={12} md={10} lg={8}>
				<TextField
					disabled={updateBilling ? false : true}
					value={adl1}
					label='Address line 1'
					variant='standard'
					type='text'
					fullWidth
					required
					onChange={e => {
						setAdl1(e.target.value);
					}}
				/>
			</Grid>
			<Grid item xs={12} md={10} lg={8}>
				<TextField
					disabled={updateBilling ? false : true}
					value={adl2}
					label='Address line 2'
					variant='standard'
					type='text'
					fullWidth
					required
					onChange={e => {
						setAdl2(e.target.value);
					}}
				/>
			</Grid>
			<Grid container item spacing={2}>
				<Grid item xs={12} md={5} lg={4}>
					<TextField
						disabled={updateBilling ? false : true}
						value={city}
						fullWidth
						variant='standard'
						label='City'
						type='text'
						required
						onChange={e => {
							setCity(e.target.value);
						}}
					/>
				</Grid>
				<Grid item xs={12} md={5} lg={4}>
					<TextField
						disabled={updateBilling ? false : true}
						value={state}
						fullWidth
						lg={6}
						variant='standard'
						label='State'
						type='text'
						required
						onChange={e => {
							setState(e.target.value);
						}}
					/>
				</Grid>
			</Grid>
			<Grid container item spacing={2}>
				<Grid item xs={12} md={5} lg={4}>
					<TextField
						disabled={updateBilling ? false : true}
						fullWidth
						value={zipcode}
						variant='standard'
						label='Pincode'
						type='text'
						required
						onChange={e => {
							setZipCode(e.target.value);
						}}
					/>
				</Grid>
			</Grid>
			<Grid container item spacing={2}>
				<Grid item xs={12} md={5} lg={4} alignSelf='end'>
					{!updateBilling && (
						<Button
							variant='contained'
							onClick={() => {
								setUpdateBilling(p => !p);
							}}>
							Update Billing address
						</Button>
					)}
					{updateBilling && (
						<Button
							variant='contained'
							sx={{ mr: 'auto' }}
							onClick={() => {}}
							color='success'>
							Save Changes
						</Button>
					)}
				</Grid>
			</Grid>
			<Grid item xs={12} md={6} lg={6}>
				<Autocomplete
					disabled={!updateBilling ? false : true}
					fullWidth
					groupBy={option => option.role}
					disablePortal
					id='combo-box-demo'
					onChange={(e, newValue) => {
						if (!editOrder) {
							setUser(newValue.name);
						} else {
							setOrderId(newValue.name);
						}
					}}
					getOptionLabel={option => `${option.name}`}
					options={!editOrder ? sort(usersList) : orderIdList}
					renderInput={params => (
						<TextField
							variant='standard'
							{...params}
							label={editOrder ? 'Select Order Id' : 'Select User'}
						/>
					)}
				/>
			</Grid>
			<Grid container item spacing={2}>
				<Grid item xs={12} md={5} lg={4}>
					<TextField
						disabled={!updateBilling ? false : true}
						fullWidth
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
				<Grid item xs={12} md={5} lg={4}>
					<TextField
						disabled={!updateBilling ? false : true}
						fullWidth
						lg={6}
						variant='standard'
						label='Discount %'
						type='text'
						helperText='Your order value is inclusive of your discount percentage. Leave blank if not applicable'
						value={discount}
						onChange={e => {
							setDiscount(e.target.value);
						}}
					/>
				</Grid>
			</Grid>
			<Grid container item spacing={2}>
				<Grid item xs={12} md={5} lg={4}>
					<TextField
						disabled={!updateBilling ? false : true}
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
				<Grid item xs={12} md={5} lg={4} alignSelf='end'>
					<TextField
						disabled={!updateBilling ? false : true}
						fullWidth
						lg={6}
						variant='standard'
						label='Invoice Date'
						type='text'
						helperText='This is the date on which your customer can view your invoice. Enter in MM/DD/YYYY format leave blank if you want to make invoice available immediately after order creation'
					/>
				</Grid>
			</Grid>
			{editOrder ? (
				<Grid container item spacing={2}>
					<Grid item xs={12} md={5} lg={4}>
						<FormControl variant='standard' fullWidth>
							<InputLabel id='order-status'>Order Status</InputLabel>
							<Select
								labelId='order-status'
								id='orderStatus'
								value={orderStatus}
								disabled={!updateBilling ? false : true}
								onChange={e => {
									setOrderStatus(e.target.value);
								}}
								label='Order Status'>
								<MenuItem value='created'>Created</MenuItem>
								<MenuItem value='completed'>Completed</MenuItem>
								<MenuItem value='refunded'>Refunded</MenuItem>
								<MenuItem value='pending'>Pending</MenuItem>
								<MenuItem value='onHold'>On Hold</MenuItem>
							</Select>
							<Typography variant='caption'>
								You cannot make a refund and make changes to an order at the
								same time
							</Typography>
						</FormControl>
					</Grid>
					{orderStatus === 'refunded' && (
						<Grid item xs={12} md={5} lg={4}>
							<TextField
								fullWidth
								disable={!updateBilling ? false : true}
								variant='standard'
								label='Refund Amount'
								type='Number'
								onChange={e => {
									setRefundAmt(Number(e.target.value));
								}}
								helperText='You can leave blank to refund full amount'
								required
							/>
						</Grid>
					)}
				</Grid>
			) : null}

			<Grid item xs={12} sm={4} md={3}>
				{orderStatus === 'refunded' && (
					<Button
						onClick={() => {
							refundOrder();
						}}
						disable={!updateBilling ? false : true}
						variant='contained'
						fullWidth
						sx={{ backgroundColor: 'red' }}
						startIcon={
							<SvgIcon>
								<UpdateIcon />
							</SvgIcon>
						}>
						Refund Order
					</Button>
				)}
				{orderStatus !== 'refunded' && editOrder && (
					<Button
						onClick={() => {
							getUserData();
						}}
						variant='contained'
						fullWidth
						color='warning'
						startIcon={
							<SvgIcon>
								<UpdateIcon />
							</SvgIcon>
						}>
						Edit Order
					</Button>
				)}
				{!editOrder && (
					<Button
						onClick={() => {
							createOrder();
						}}
						variant='contained'
						fullWidth
						color='success'
						startIcon={
							<SvgIcon>
								<PrinterPrintSvgrepoComIcon />
							</SvgIcon>
						}>
						Create Order
					</Button>
				)}
			</Grid>
		</Grid>
	);
};
export default CreateNewOrderForm;
