import React, {
	useEffect,
	useContext,
	useState,
	useCallback,
	Suspense,
	Fragment,
} from 'react';
import { v4 as uuid } from 'uuid';

import Invoice from './Invoice';
import { experimentalStyled as styled } from '@mui/material/styles';
import AuthContext from '../context/AuthProvider';
import SvgIcon from '@mui/material/SvgIcon';
import { toast } from 'react-toastify';
import {
	Grid,
	IconButton,
	Paper,
	Box,
	InputLabel,
	Typography,
	Tabs,
	Tab,
	TableContainer,
	Table,
	TableBody,
	TableRow,
	TableHead,
	TableCell,
	Chip,
	FormControl,
	Select,
	MenuItem,
} from '@mui/material';
import { ReactComponent as PackageDeliveredIcon } from './../img/package-delivered.svg';
import { ReactComponent as PackageDeliveredStatusTimeIcon } from './../img/package-delivered-status-time.svg';
import { ReactComponent as ParcelBoxPackageIcon } from './../img/parcel-box-package.svg';

const CreateNewOrderForm = React.lazy(() => import('./CreateNewOrderForm'));
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
const OrdersTable = ({ orders }) => {
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
						<TableRow>
							<TableCell>Order Id</TableCell>
							<TableCell>User</TableCell>
							<TableCell>Service</TableCell>
							<TableCell>Order Value</TableCell>
							<TableCell>Order Status</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{orders.map(order => (
							<Fragment key={uuid()}>
								<TableRow>
									<TableCell>{order.id}</TableCell>
									<TableCell>{order.user.username}</TableCell>
									<TableCell>{order.service.title}</TableCell>
									<TableCell>{order.value} ₹</TableCell>
									<TableCell>
										<Chip
											label={order.status}
											style={{
												backgroundColor: `${statuscolor(order.status)}`,
											}}
										/>
									</TableCell>
								</TableRow>
							</Fragment>
						))}
						<TableRow>
							<TableCell></TableCell>
							<TableCell></TableCell>
							<TableCell>
								<b style={{ color: '#1976d2' }}>Total Value</b>
							</TableCell>
							<TableCell>
								<b style={{ color: '#1976d2' }}>{totalVal} ₹</b>
							</TableCell>
						</TableRow>
					</TableBody>
				</Table>
			</TableContainer>
		</>
	);
};
const Orders = () => {
	const [orders, setOrders] = useState([]);
	let authctx = useContext(AuthContext);
	const [value, setValue] = useState(0);
	const [selectedUser, setSelectedUser] = useState('');
	const [filterOrderStatus, setfilterOrderStatus] = useState('');
	const handleChange = (event, newValue) => {
		setValue(newValue);
	};
	const filterOrders = criteria => {
		switch (criteria) {
			case 'refunded':
				return orders.filter(order => order.status === 'refunded');
			case 'onHold':
				return orders.filter(order => order.status === 'onHold');
			case 'pending':
				return orders.filter(order => order.status === 'pending');
			case 'completed':
				return orders.filter(order => order.status === 'completed');
			case 'failed':
				return orders.filter(order => order.status === 'failed');
			default:
				return orders;
		}
	};
	let axiosPvt = authctx.useAxiosPrivate();
	useEffect(() => {
		let controller = new AbortController();
		//TODO reqdata from serverside: status, username, value,service title ,id
		axiosPvt
			.get('/orders', { signal: controller.signal })
			.then(response => {
				let { data } = response;
				setOrders([...data]);
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
							{orders.filter(order => order.status === 'pending').length}
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
							{orders.filter(order => order.status === 'completed').length}
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

								<Tab label='Create/Edit Order' {...a11yProps(1)} />
							</Tabs>
						</Box>
						<TabPanel value={value} index={0}>
							{orders.length !== 0 && (
								<>
									<Grid container spacing={2}>
										<Grid item lg={4}>
											<FormControl fullWidth>
												<InputLabel id='order-status'>
													Filter by order status
												</InputLabel>
												<Select
													value={filterOrderStatus}
													labelId='order-status'
													onChange={e => {
														setfilterOrderStatus(e.target.value);
													}}
													label='Filter by order status'>
													<MenuItem value='refunded'>Refunded</MenuItem>
													<MenuItem value='completed'>Completed</MenuItem>
													<MenuItem value='failed'>Failed</MenuItem>
													<MenuItem value='onHold'>On Hold</MenuItem>
													<MenuItem value='onHold'>Pending</MenuItem>
												</Select>
											</FormControl>
										</Grid>
										<Grid item lg={4}>
											<FormControl fullWidth>
												<InputLabel id='user-list'>Filter by user</InputLabel>
												<Select
													value={selectedUser}
													label='Filter by user'
													labelId='user-list'
													onChange={e => {
														setSelectedUser(e.target.value);
													}}>
													<MenuItem value='none'>None</MenuItem>
													{orders &&
														orders
															.sort((a, b) => {
																if (a.user.username > b.user.username) {
																	return 1;
																} else {
																	return -1;
																}
															})
															.map(element => (
																<MenuItem
																	key={element.user.username}
																	value={element.user.username}>
																	{element.user.username}
																</MenuItem>
															))}
												</Select>
											</FormControl>
										</Grid>
									</Grid>
									{selectedUser && selectedUser !== 'none' && (
										<OrdersTable
											orders={orders.filter(
												order => order.user.username === selectedUser
											)}
										/>
									)}
									{filterOrderStatus &&
										(!selectedUser || selectedUser === 'none') && (
											<OrdersTable
												orders={filterOrders(`${filterOrderStatus}`)}
											/>
										)}
									{!filterOrderStatus &&
										(!selectedUser || selectedUser === 'none') && (
											<OrdersTable orders={orders} />
										)}
								</>
							)}
						</TabPanel>

						<TabPanel value={value} index={1}>
							<Suspense fallback={<div>Loading...</div>}>
								<CreateNewOrderForm />
							</Suspense>
						</TabPanel>
					</Item>
				</Grid>
			</Grid>
		</>
	);
};

export default Orders;
