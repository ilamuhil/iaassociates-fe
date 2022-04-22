import { useState, useEffect, useContext } from 'react';
import AuthContext from '../context/AuthProvider';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from '../api/axios';
import AddIcon from '@mui/icons-material/Add';
import {
	Avatar,
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
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import LockResetIcon from '@mui/icons-material/LockReset';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
const UsersList = () => {
	const [rows, setRows] = useState([]);
	const [open, setOpen] = useState(false);
	const [resetPwdEmail, setResetPwdEmail] = useState('');
	const ctx = useContext(AuthContext);
	const axiosPvt = ctx.useAxiosPrivate();
	const theme = useTheme();
	const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
	const [deleteUser, setDeleteUser] = useState(false);
	const resetPassword = async email => {
		const id = toast.loading('Processing request');
		try {
			let response = await axios.post('updates/resetPasswordRequest', {
				email,
			});
			toast.update(id, {
				render: response.data,
				type: 'sucess',
				isLoading: false,
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
			type: 'string',
			editable: false,
		},
		{
			id: 2,
			field: 'avatar',
			headerName: 'Avatar',
			width: 100,
		},
		{
			id: 3,
			field: 'username',
			headerName: 'Username',
			width: 175,
			type: 'string',
			editable: true,
		},
		{
			id: 4,
			field: 'email',
			headerName: 'Email',
			type: 'string',
			width: 220,
			editable: true,
		},
		{
			id: 5,
			field: 'role',
			headerName: 'Role',
			type: 'string',
			editable: true,
		},
		{
			id: 6,
			field: 'Password Reset',
			headerName: 'Password Reset',
			width: 150,
			editable: false,
		},
		{
			id: 7,
			field: 'actions',
			headerName: 'Actions',
			width: 220,
		},
	];
	const deleteuser = () => {
		const id = toast.loading('Deleting user from database...');
		axiosPvt
			.delete('/users', { email: resetPwdEmail })
			.then(res => {
				toast.update(id, {
					render: res.data,
					type: 'sucess',
					isLoading: false,
				});
			})
			.catch(e => {
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
						avatar: true,
					},
				});
				let { data } = users;
				let arr = [];
				data.forEach((user, index) => {
					let { username, email, role, avatar, id } = user;

					arr = [
						...arr,
						{
							id,
							username,
							email,
							role,
							avatar: (
								<Avatar
									src={avatar}
									sx={{
										boxShadow: 2,
										border: '2px solid white',
										width: 30,
										height: 30,
									}}
								/>
							),
						},
					];
				});
				setRows(arr);
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
										backgroundImage:
											'linear-gradient(315deg, #e7eff9 0%, #cfd6e6 74%)',
									}}>
									<TableHead>
										<TableRow>
											{columns.map(col => (
												<TableCell key={`${col.id}`}>
													{col.headerName}
												</TableCell>
											))}
										</TableRow>
									</TableHead>
									<TableBody>
										{rows.map(row => (
											<TableRow key={row.id}>
												<TableCell>{row.id}</TableCell>
												<TableCell>{row.avatar}</TableCell>
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
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</div>
						</Grid>
						<Dialog
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
