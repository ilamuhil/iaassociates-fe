import { useState, useEffect, useContext } from 'react';
import AuthContext from '../context/AuthProvider';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import {
	Grid,
	Button,
	Dialog,
	DialogTitle,
	DialogContentText,
	DialogContent,
	DialogActions,
	IconButton,
	Table,
	TableHead,
	TableRow,
	TableCell,
	TableBody,
	FormGroup,
	Checkbox,
	FormControlLabel,
	FormLabel,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import LockResetIcon from '@mui/icons-material/LockReset';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from './../api/axios';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
const sort = arr => {
	let adminsorted = arr
		.filter(e => e.role === 'admin')
		.sort((a, b) => {
			if (a.username >= b.username) return 1;
			return -1;
		});
	let customersorted = arr
		.filter(e => e.role === 'customer')
		.sort((a, b) => {
			if (a.username >= b.username) return 1;
			return -1;
		});
	let usersorted = arr
		.filter(e => e.role === 'user')
		.sort((a, b) => {
			if (a.username >= b.username) return 1;
			return -1;
		});
	return [...customersorted, ...usersorted, ...adminsorted];
};
const UsersList = () => {
	const [rows, setRows] = useState([]);
	const [openDownloadDialog, setOpenDownloadDialog] = useState(false);
	const [open, setOpen] = useState(false);
	const [resetPwdUsername, setResetPwdUsername] = useState('');
	const [resetPwdEmail, setResetPwdEmail] = useState('');
	const ctx = useContext(AuthContext);
	const axiosPvt = ctx.useAxiosPrivate();
	const theme = useTheme();
	const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
	const [deleteUser, setDeleteUser] = useState(false);
	const resetPassword = async () => {
		const id = toast.loading('Processing request');
		try {
			let response = await axios.post('updates/resetPasswordRequest', {
				email: resetPwdEmail,
				username: resetPwdUsername,
			});
			toast.update(id, {
				render: response.data,
				type: 'success',
				isLoading: false,
				autoClose: 1500,
			});
			handleClose();
		} catch (e) {
			if (e.response) {
				toast.update(id, {
					render: e.response.data,
					type: 'error',
					isLoading: false,
				});
			} else {
				toast.update(id, {
					render: 'Server Unavailable. Try again later',
					type: 'error',
					isLoading: false,
				});
			}
		}
	};
	const handleClose = () => {
		setOpen(false);
	};
	const columns = [
		{
			id: 1,
			field: 'id',
			headerName: 'User Id',
			width: 75,
		},

		{
			id: 2,
			field: 'username',
			headerName: 'Username',
			width: 175,
		},
		{
			id: 3,
			field: 'email',
			headerName: 'Email',
			width: 220,
		},
		{
			id: 4,
			field: 'role',
			headerName: 'Role',
		},
		{
			id: 5,
			field: 'Password Reset',
			headerName: 'Password Reset',
			width: 150,
		},
		{
			id: 6,
			field: 'actions',
			headerName: 'Actions',
			width: 220,
		},
	];
	const closeDownloadDialog = () => {
		setOpenDownloadDialog(false);
	};
	const deleteuser = () => {
		toast
			.promise(axiosPvt.delete(`/user/username/${resetPwdUsername}`), {
				pending: 'deleting user from database',
				success: 'Successfully deleted user from database',
				error: 'Could not delete user from database',
			})
			.then(() => {
				handleClose();
				window.location.reload();
			});
	};

	useEffect(() => {
		const controller = new AbortController();
		(async () => {
			try {
				let users = await axiosPvt.get('/user/multiple', {
					signal: controller.signal,
					params: {
						id: true,
						username: true,
						email: true,
						role: true,
					},
				});
				let { data } = users;
				let arr = [];
				data.forEach((user, index) => {
					let { username, email, role, id } = user;

					arr = [
						...arr,
						{
							id,
							username,
							email,
							role,
						},
					];
				});
				setRows(sort(arr));
			} catch (e) {
				console.log(e);
			}
		})();
		return () => {
			controller.abort();
		};
	}, [axiosPvt]);
	return (
		<>
			<div>
				{rows && (
					<>
						<Grid item>
							<div style={{ height: 700, width: '100%' }}>
								<Button
									component={Link}
									to='newUser'
									variant='contained'
									sx={{ my: 4 }}
									startIcon={<AddIcon />}>
									Create new User
								</Button>
								<Table
									style={{
										borderRadius: '4px',
										marginBlock: '5px',
										border: '1px solid #cee0f3',
									}}>
									<TableHead>
										<TableRow
											sx={{
												borderRadius: 4,
												backgroundColor: '#1976d2',
											}}>
											{columns.map(col => (
												<TableCell
													key={`${col.id}`}
													sx={{ textTransform: 'uppercase', color: 'white' }}>
													{col.headerName}
												</TableCell>
											))}
										</TableRow>
									</TableHead>
									<TableBody>
										{rows.map(row => (
											<TableRow
												key={row.id}
												sx={{
													'&:nth-of-type(even)': {
														backgroundColor: '#cee0f3',
													},
													// hide last border
													'&:last-child td, &:last-child th': {
														border: 0,
													},
												}}>
												<TableCell>{row.id}</TableCell>
												<TableCell>{row.username}</TableCell>
												<TableCell>{row.email}</TableCell>
												<TableCell>{row.role}</TableCell>
												<TableCell>
													<Button
														size='small'
														sx={{
															border: 'none',
															backgroundColor: 'white',
															boxShadow: 1,
														}}
														onClick={() => {
															setDeleteUser(false);
															setResetPwdEmail(row.email);
															setResetPwdUsername(row.username);
															setOpen(true);
														}}>
														<LockResetIcon sx={{ color: 'red' }} />
													</Button>
												</TableCell>
												<TableCell sx={{ minWidth: '200px' }}>
													<IconButton
														size='small'
														component={Link}
														to={`/dashboard/user/${row.id}`}
														sx={{
															backgroundColor: 'white',
															color: '#039be5',
															mx: 1,
															boxShadow: 2,
														}}>
														<EditIcon fontSize='10px'></EditIcon>
													</IconButton>
													<IconButton
														onClick={() => {
															setDeleteUser(true);
															setResetPwdUsername(row.username);
															setResetPwdEmail(row.email);
															setOpen(true);
														}}
														size='small'
														sx={{
															backgroundColor: 'white',
															color: 'red',
															mx: 1,
															boxShadow: 2,
														}}>
														<DeleteIcon fontSize='10px'></DeleteIcon>
													</IconButton>
													<IconButton
														onClick={() => {
															setResetPwdUsername(row.username);
															setOpenDownloadDialog(true);
														}}
														size='small'
														sx={{
															backgroundColor: 'white',
															color: '#e1ad01',
															mx: 1,
															boxShadow: 2,
														}}>
														<FileDownloadIcon fontSize='10px' />
													</IconButton>
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</div>
						</Grid>
						<DownloadData
							open={openDownloadDialog}
							handleClose={closeDownloadDialog}
							username={resetPwdUsername}
						/>
						<Dialog
							sx={{
								'& .MuiDialog-paper': {
									backgroundColor: 'white',
									borderRadius: '1rem',
									paddingTop: '1rem',
								},
							}}
							fullScreen={fullScreen}
							open={open}
							onClose={handleClose}
							aria-labelledby='responsive-dialog-title'>
							<DialogTitle
								id='responsive-dialog-title'
								sx={{ color: 'orange' }}>
								<b>Warning!</b>
							</DialogTitle>
							<DialogContent>
								{!deleteUser && (
									<DialogContentText>
										Are you sure you want to send a Password Reset link to{' '}
										<b style={{ color: 'black' }}>
											{resetPwdEmail && resetPwdEmail}?
										</b>{' '}
										<br /> Do not send Password Reset link emails unless
										requested by the User.
									</DialogContentText>
								)}
								{deleteUser && (
									<DialogContentText>
										Are you sure you want to delete user{' '}
										<b style={{ color: 'black' }}>
											{resetPwdEmail && resetPwdEmail}?
										</b>{' '}
										<br></br> All orders, invoices and other associated data
										will be removed.
										<br />
										<b>
											<span className='text-danger text-uppercase'>
												This action is irreversible
											</span>
										</b>
									</DialogContentText>
								)}
							</DialogContent>
							<DialogActions>
								<Button
									color={!deleteUser ? 'error' : 'success'}
									autoFocus
									onClick={handleClose}>
									Exit
								</Button>
								<Button
									color={deleteUser ? 'error' : 'success'}
									onClick={() => {
										if (!deleteUser) {
											resetPassword();
										} else {
											deleteuser();
										}
									}}
									autoFocus>
									{deleteUser ? 'Delete user' : 'Send Email'}
								</Button>
							</DialogActions>
						</Dialog>
					</>
				)}
			</div>
		</>
	);
};
export default UsersList;

function DownloadData({ open, handleClose, username }) {
	const ctx = useContext(AuthContext);
	const axiosPvt = ctx.useAxiosPrivate();
	const theme = useTheme();
	const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
	const [url, setUrl] = useState('');
	const [checkBoxData, setCheckboxData] = useState({
		id: true,
		username: true,
		email: true,
		address: true,
		marketingPreference: true,
		createdAt: true,
		role: true,
		orders: true,
		reviews: true,
	});
	const getData = () => {
		let paramsData = {};
		Object.keys(checkBoxData).forEach(key => {
			if (checkBoxData[key] === true)
				paramsData = { ...paramsData, [key]: checkBoxData[key] };
		});
		console.log(paramsData);
		axiosPvt
			.get(`/user/username/${username}`, {
				params: paramsData,
			})
			.then(({ data }) => {
				setUrl(
					URL.createObjectURL(
						new Blob([JSON.stringify(data)], { type: 'application/json' })
					)
				);
			})
			.then(() => {
				toast.success('Fetched data successfully');
			})
			.catch(e => {
				toast.error('Could not fetch required data');
			});
	};
	return (
		<Dialog
			fullScreen={fullScreen}
			open={open}
			onClose={handleClose}
			aria-labelledby='responsive-dialog-title'>
			<DialogTitle id='responsive-dialog-title' sx={{ color: 'orange' }}>
				<b>Download User &amp; Related Data</b>
			</DialogTitle>
			<DialogContent>
				<FormLabel component='legend'>
					Select the data you wish to download for this User
				</FormLabel>
				<FormGroup>
					{Object.keys(checkBoxData).map(objKey => (
						<FormControlLabel
							key={objKey}
							control={
								<Checkbox
									checked={checkBoxData[objKey]}
									onChange={e => {
										setCheckboxData(p => ({
											...p,
											[objKey]: e.target.checked,
										}));
									}}
								/>
							}
							label={objKey}
						/>
					))}
				</FormGroup>
			</DialogContent>
			<DialogActions>
				<Button color='error' autoFocus onClick={handleClose}>
					Close
				</Button>
				{!url && (
					<Button color='primary' onClick={getData} autoFocus>
						Fetch Selected data
					</Button>
				)}

				{url && (
					<Button
						component='a'
						href={url}
						download={`${username}.json`}
						variant='contained'
						startIcon={<FileDownloadIcon />}>
						Download Json file
					</Button>
				)}
			</DialogActions>
		</Dialog>
	);
}
