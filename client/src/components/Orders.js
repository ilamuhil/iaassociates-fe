import React, { useEffect, useContext, useState, useCallback } from 'react';
import { format } from 'date-fns';
// import Invoice from './Invoice';
import { experimentalStyled as styled } from '@mui/material/styles';
import AuthContext from '../context/AuthProvider';
import SvgIcon from '@mui/material/SvgIcon';
import { toast } from 'react-toastify';
import {
	Grid,
	Button,
	IconButton,
	Paper,
	Box,
	InputLabel,
	Typography,
	ListSubheader,
	Tabs,
	Tab,
	FormControl,
	Select,
	MenuItem,
	Dialog,
	DialogContent,
	DialogActions,
	DialogContentText,
	DialogTitle,
} from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { ReactComponent as PackageDeliveredIcon } from './../img/package-delivered.svg';
import { ReactComponent as PackageDeliveredStatusTimeIcon } from './../img/package-delivered-status-time.svg';
import { ReactComponent as ParcelBoxPackageIcon } from './../img/parcel-box-package.svg';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import OrdersTable from './OrderTable';
import OrderActionsWrapper from './OrderActionsWrapper';

const CreateNewOrderForm = React.lazy(() => import('./NewOrder'));
const Item = styled(Paper)(({ theme }) => ({
	backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
	...theme.typography.body2,
	padding: theme.spacing(2),
	textAlign: 'center',
	color: theme.palette.text.secondary,
}));

function a11yProps(index) {
	return {
		id: `simple-tab-${index}`,
		'aria-controls': `simple-tabpanel-${index}`,
	};
}

function TabPanel(props) {
	const { children, value, index, ...other } = props;

	return (
		<div
			role='tabpanel'
			hidden={value !== index}
			id={`simple-tabpanel-${index}`}
			aria-labelledby={`simple-tab-${index}`}
			{...other}>
			{value === index && <Box sx={{ p: 3 }}>{children}</Box>}
		</div>
	);
}

const Orders = () => {
	const theme = useTheme();
	const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
	const [orders, setOrders] = useState([]);
	const [orderId, setOrderId] = useState(0);
	let authctx = useContext(AuthContext);
	const [value, setValue] = useState(0);
	const [selectedUser, setSelectedUser] = useState('');
	const [filter, setFilter] = useState('');
	const [userList, setUserList] = useState();
	const [open, setOpen] = useState(false);
	const handleChange = (event, newValue) => {
		setValue(newValue);
	};
	const [downloadLink, setDownloadLink] = useState('');
	let axiosPvt = authctx.useAxiosPrivate();
	const downloadData = useCallback(
		async value => {
			const toastId = toast.loading('fetching data');
			try {
				let res = await axiosPvt.get(`/orders/downloads/${value}`);
				setDownloadLink(
					URL.createObjectURL(
						new Blob([JSON.stringify(res.data)], { type: 'application/json' })
					)
				);
				toast.update(toastId, {
					render: 'Data fetched successfully',
					type: 'success',
					isLoading: false,
					autoClose: 1500,
				});
			} catch (e) {
				console.log(e);

				toast.update(toastId, {
					render: e.response
						? e.response.data
						: 'Server unavailable,try again later',
					type: e.response ? 'warning' : 'error',
					isLoading: false,
					autoClose: 1500,
				});
			}
		},
		[axiosPvt]
	);
	const sendPaymentReminder = useCallback(() => {
		toast.promise(
			axiosPvt.post(`/users/sendReminder/${selectedUser}/`),
			{
				pending: 'Processing request',
				error: 'An error occurred',
				success: 'Payment reminder sent',
			},
			[selectedUser]
		);
	});

	const filterOrders = useCallback(
		val => {
			let criteria;
			if (filter === 'true' || filter === 'false') {
				criteria = { paymentStatus: val };
			} else {
				criteria = { orderStatus: val };
			}
			let url = selectedUser
				? `/orders/getorders/username/${selectedUser}`
				: '/orders/getorders';
			axiosPvt
				.get(url, {
					params: criteria,
				})
				.then(({ data }) => {
					setOrders(data);
				})
				.catch(e => {});
		},
		[axiosPvt, selectedUser, filter]
	);
	useEffect(() => {
		let controller = new AbortController();
		//TODO reqdata from serverside: status, username, value,service title ,id
		axiosPvt
			.get('/orders/getorders', { signal: controller.signal })
			.then(response => {
				let { data } = response;
				setUserList([...new Set(data.map(order => order.username).sort())]);
				setOrders(order => [...order, ...data]);
			})
			.catch(e => {
				console.error(e);
			});
		return () => {
			controller.abort();
		};
	}, [axiosPvt]);
	return (
		<>
			<Grid
				container
				columnSpacing={{ md: 1 }}
				rowSpacing={2}
				direction='row'
				justifyContent='space-around'
				alignItems='center'>
				<Grid item xs={12} sm={9} md={4} lg={3}>
					<Item
						style={{
							backgroundColor: '#045de9',
							backgroundImage:
								'linear-gradient(315deg, #045de9 0%, #09c6f9 74%)',
						}}>
						<IconButton
							aria-label=''
							sx={{
								backgroundColor: '#fbb034',
								backgroundImage:
									'linear-gradient(315deg, #fbb034 0%, #ffdd00 74%)',
								p: 2,
								mb: 2,
							}}>
							<SvgIcon titleAccess='Pending Orders' fontSize='large'>
								<PackageDeliveredStatusTimeIcon />
							</SvgIcon>
						</IconButton>
						<Typography variant='h6' color='#ff9f00'>
							PENDING ORDERS
						</Typography>
						<Typography variant='button' color='#ff9f00'>
							{orders.filter(order => order.orderStatus === 'pending').length}
						</Typography>
					</Item>
				</Grid>
				<Grid item xs={12} sm={9} md={4} lg={3}>
					<Item
						style={{
							backgroundColor: '#045de9',
							backgroundImage:
								'linear-gradient(315deg, #045de9 0%, #09c6f9 74%)',
						}}>
						<IconButton
							aria-label=''
							sx={{
								backgroundColor: '#fbb034',
								backgroundImage:
									'linear-gradient(315deg, #b8d3fe 0%, #aecad6 74%)',
								p: 2,
								mb: 2,
							}}>
							<SvgIcon titleAccess='Pending Orders' fontSize='large'>
								<ParcelBoxPackageIcon />
							</SvgIcon>
						</IconButton>
						<Typography variant='h6' color='#aecad6'>
							TOTAL ORDERS
						</Typography>
						<Typography variant='button' color='#aecad6'>
							{orders.length}
						</Typography>
					</Item>
				</Grid>
				<Grid item xs={12} sm={9} md={4} lg={3}>
					<Item
						style={{
							backgroundColor: '#045de9',
							backgroundImage:
								'linear-gradient(315deg, #045de9 0%, #09c6f9 74%)',
						}}>
						<IconButton
							aria-label=''
							sx={{
								backgroundColor: '#84fb95',
								backgroundImage:
									'linear-gradient(315deg, #98de5b 0%, #08e1ae 74%)',
								p: 2,
								mb: 2,
							}}>
							<SvgIcon titleAccess='Pending Orders' fontSize='large'>
								<PackageDeliveredIcon />
							</SvgIcon>
						</IconButton>
						<Typography variant='h6' color='#7fff00'>
							COMPLETE ORDERS
						</Typography>
						<Typography variant='button' color='#7fff00'>
							{orders.filter(order => order.orderStatus === 'completed').length}
						</Typography>
					</Item>
				</Grid>
			</Grid>
			<Grid container my={4}>
				<Grid item lg={12}>
					<Item
						style={{
							backgroundColor: '#e7eff9',
							backgroundImage:
								'linear-gradient(315deg, #e7eff9 0%, #cfd6e6 74%)',
						}}>
						<Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
							<Tabs
								value={value}
								onChange={handleChange}
								aria-label='Orders Tab'
								centered>
								<Tab label='All Orders' {...a11yProps(0)} />

								<Tab label='Order Actions' {...a11yProps(1)} />
							</Tabs>
						</Box>
						<TabPanel value={value} index={0}>
							{orders.length !== 0 && (
								<>
									<Grid container spacing={2}>
										<Grid item lg={3} md={4}>
											<FormControl fullWidth>
												<InputLabel id='status'>Filter by status</InputLabel>
												<Select
													value={filter}
													labelId='status'
													onChange={e => {
														if (e.target.value === 'none') {
															setFilter('');
															return;
														}
														setFilter(e.target.value);
														filterOrders(e.target.value);
													}}
													label='Filter by status'>
													<MenuItem value=''>None</MenuItem>
													<ListSubheader>Order Status</ListSubheader>
													<MenuItem value='onhold'>On Hold</MenuItem>
													<MenuItem value='pending'>Pending</MenuItem>
													<MenuItem value='refunded'>Refunded</MenuItem>
													<MenuItem value='completed'>Completed</MenuItem>
													<MenuItem value='failed'>Failed</MenuItem>
													<ListSubheader>Payment Status</ListSubheader>
													<MenuItem value='true'>Paid Orders</MenuItem>
													<MenuItem value='false'>Unpaid Orders</MenuItem>
												</Select>
											</FormControl>
										</Grid>
										<Grid item lg={3}>
											<FormControl fullWidth>
												<InputLabel id='user-list'>Filter by user</InputLabel>
												<Select
													value={selectedUser}
													label='Filter by user'
													labelId='user-list'
													defaultValue=''
													onChange={e => {
														setSelectedUser(e.target.value);
														console.log(e.target.value);
													}}>
													<MenuItem value='none'>None</MenuItem>
													{orders &&
														userList.map(element => (
															<MenuItem key={`${element}`} value={`${element}`}>
																{element}
															</MenuItem>
														))}
												</Select>
											</FormControl>
										</Grid>
										<Grid item lg={3}>
											<FormControl fullWidth>
												<InputLabel id='Sort'>Sort</InputLabel>
												<Select
													value={selectedUser}
													label='Sort'
													labelId='Sort'
													onChange={e => {
														setOrders(orders => {
															if (e.target.value === 'price') {
																return orders.sort((a, b) => {
																	if (a.value >= b.value) return -1;
																	return 1;
																});
															} else {
																return orders.sort((a, b) => {
																	if (a.createdAt >= b.createdAt) return -1;
																	return 1;
																});
															}
														});
														filterOrders();
													}}>
													<MenuItem value='price'>Order Value</MenuItem>
													<MenuItem value='createdAt'>Order Date</MenuItem>
												</Select>
											</FormControl>
										</Grid>
									</Grid>
									<Grid container spacing={2} sx={{ my: 4 }}>
										<Grid item lg={3}>
											<FormControl fullWidth>
												<InputLabel id='Download monthly orders'>
													Download monthly orders report
												</InputLabel>
												<Select
													value={selectedUser}
													label='Download monthly orders'
													labelId='Download monthly orders'
													onChange={e => {
														downloadData(e.target.value);
													}}>
													{[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(value => (
														<MenuItem key={value} value={value}>
															{format(new Date(2022, value, 1), 'MMMM')}
														</MenuItem>
													))}
												</Select>
											</FormControl>
										</Grid>
										{downloadLink && (
											<Grid item lg={3}>
												<Button
													variant='contained'
													href={downloadLink}
													component='a'
													onClick={() => {
														setDownloadLink('');
													}}
													endIcon={<FileDownloadIcon />}
													download='MonthlyReport'>
													Download data
												</Button>
											</Grid>
										)}
									</Grid>
									<Dialog
										fullScreen={fullScreen}
										open={open}
										onClose={() => {
											setOpen(false);
										}}
										aria-labelledby='responsive-dialog-title'>
										<DialogTitle
											id='responsive-dialog-title'
											sx={{ color: 'orange' }}>
											<b>Payment Reminder</b>
										</DialogTitle>
										<DialogContent>
											{selectedUser && (
												<DialogContentText>
													Are you sure you want to send a payment reminder to
													<b style={{ color: 'black' }}>
														{selectedUser && selectedUser}?
													</b>{' '}
													<br />
												</DialogContentText>
											)}
										</DialogContent>
										<DialogActions>
											<Button
												color='error'
												autoFocus
												onClick={() => {
													setOpen(false);
												}}>
												Exit
											</Button>
											<Button
												color='success'
												onClick={sendPaymentReminder}
												autoFocus>
												Send Reminder
											</Button>
										</DialogActions>
									</Dialog>
									<OrdersTable
										orders={orders}
										setOpen={setOpen}
										setOrderId={setOrderId}
										setSelectedUser={setSelectedUser}
									/>
								</>
							)}
						</TabPanel>
						<TabPanel value={value} index={1}>
							<OrderActionsWrapper />
						</TabPanel>
					</Item>
				</Grid>
			</Grid>
		</>
	);
};

export default Orders;
