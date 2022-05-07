import {
	Avatar,
	Box,
	Button,
	Card,
	CardActions,
	CardContent,
	Divider,
	Typography,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	IconButton,
	Backdrop,
	CircularProgress,
} from '@mui/material';
import AvatarImgf1 from '../../img/avatar/avatarf1.png';
import AvatarImgf2 from '../../img/avatar/avatarf2.png';
import AvatarImgf3 from '../../img/avatar/avatarf3.png';
import AvatarImgf4 from '../../img/avatar/avatarf4.png';
import AvatarImgm1 from '../../img/avatar/avatarm1.png';
import AvatarImgm2 from '../../img/avatar/avatarm2.png';
import AvatarImgm3 from '../../img/avatar/avatarm3.png';
import AvatarImgm4 from '../../img/avatar/avatarm4.png';
import CallIcon from '@mui/icons-material/Call';
import {
	useState,
	useEffect,
	useCallback,
	useContext,
	lazy,
	Suspense,
} from 'react';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import { toast } from 'react-toastify';
import AuthContext from '../../context/AuthProvider';
import { useParams } from 'react-router-dom';
import { format } from 'date-fns';
const UpdateBilling = lazy(() => import('./UpdateBilling'));
const UpdatePassword = lazy(() => import('./UpdatePassword'));
const MarketingSetting = lazy(() =>
	import('../MarketingAndAnalytics/MarketingSetting')
);
const Profile = props => {
	const { id: urlpath } = useParams();
	const ctx = useContext(AuthContext);
	const [joined, setJoined] = useState('');
	const [newAvatar, setNewAvatar] = useState('');
	const [active, setActive] = useState('');
	const [email, setEmail] = useState('');
	const [username, setUsername] = useState('');
	const [avatar, setAvatar] = useState('');
	const [role, setRole] = useState('');
	const [editMode, setEditMode] = useState(false);
	const [open, setOpen] = useState(false);
	const axiosPvt = ctx.useAxiosPrivate();
	const [isLoading, setLoading] = useState(true);
	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const selectAvatar = useCallback(() => {
		switch (active) {
			case 'f1':
				setAvatar(AvatarImgf1);
				break;
			case 'f2':
				setAvatar(AvatarImgf2);
				break;
			case 'f3':
				setAvatar(AvatarImgf3);
				break;
			case 'f4':
				setAvatar(AvatarImgf4);
				break;
			case 'm2':
				setAvatar(AvatarImgm2);
				break;
			case 'm3':
				setAvatar(AvatarImgm3);
				break;
			case 'm4':
				setAvatar(AvatarImgm4);
				break;
			default:
				setAvatar(AvatarImgm1);
		}
	}, [active]);
	const updateAvatar = useCallback(() => {
		const payload = { avatar: newAvatar };
		const toastId = toast.loading('Updating Avatar...');
		selectAvatar();
		const URL = urlpath ? `user/avatar/${urlpath}` : 'user/avatar/';
		axiosPvt
			.put(URL, payload)
			.then(res => {
				toast.update(toastId, {
					render: 'Avatar Updated Successfully',
					isLoading: false,
					type: 'success',
					autoClose: 1000,
				});
				window.location.reload();
			})
			.catch(err => {
				console.error(err);
				toast.update(toastId, {
					render: 'An error occurred',
					isLoading: false,
					type: 'error',
					autoClose: 1000,
				});
				setOpen(false);
			});
	}, [newAvatar, selectAvatar, axiosPvt, urlpath]);

	useEffect(() => {
		const controller = new AbortController();
		const getUser = async () => {
			try {
				const reqPath = urlpath ? `/user/id/${urlpath}` : `/user`;
				let resp = await axiosPvt.get(reqPath, {
					signal: controller.signal,
					params: {
						email: 'true',
						username: 'true',
						avatar: 'true',
						id: 'true',
						role: 'true',
						createdAt: 'true',
					},
				});
				let {
					email,
					username,
					avatar = '',
					role = 'user',

					createdAt,
				} = resp.data;
				setEmail(email);
				setUsername(username);
				setActive(avatar);
				selectAvatar();

				setRole(role);
				setJoined(createdAt);
			} catch (e) {
				console.error(e);
			}
		};
		getUser();
		setTimeout(() => {
			setLoading(false);
		}, 1000);
		return () => {
			controller.abort();
		};
	}, [axiosPvt, selectAvatar, urlpath]);

	return (
		<>
			<div className='row'>
				<div className='col-md-6 col-lg-4'>
					{username && (
						<>
							<Card
								{...props}
								style={{
									background:
										'linear-gradient(315deg, #e7eff9 0%, #cfd6e6 74%)',
								}}>
								<CardContent>
									<Box
										sx={{
											alignItems: 'center',
											display: 'flex',
											flexDirection: 'column',
										}}>
										<Avatar
											src={avatar}
											sx={{
												height: 80,
												mb: 2,
												width: 80,
												boxShadow: 2,
												border: '4px solid white',
											}}
										/>
										<Typography
											color='textPrimary'
											gutterBottom
											variant='caption'>
											<b>{role}</b>
										</Typography>
										<Typography color='textPrimary' gutterBottom variant='h5'>
											{username}
										</Typography>
										<Typography
											color='textPrimary'
											gutterBottom
											variant='body2'>
											{email}
										</Typography>
									</Box>
								</CardContent>
								<Divider />
								<CardActions disableSpacing sx={{ justifyContent: 'center' }}>
									<Button
										color='primary'
										variant='text'
										onClick={e => {
											setEditMode(p => !p);
										}}>
										Edit Profile
									</Button>
								</CardActions>
							</Card>
							<Dialog
								open={open}
								onClose={handleClose}
								aria-labelledby='alert-dialog-title'
								aria-describedby='alert-dialog-description'>
								<DialogTitle id='alert-dialog-title'>
									{'Choose an Avatar'}
								</DialogTitle>
								<DialogContent>
									<div className='row mb-3'>
										<div className='col'>
											<IconButton
												onClick={() => {
													setNewAvatar('f1');
												}}>
												<Avatar
													sx={{
														width: 64,
														height: 64,
														border:
															newAvatar === 'f1' ? '2px solid green' : 'none',
													}}
													src={AvatarImgf1}
												/>
											</IconButton>
										</div>

										<div className='col'>
											<IconButton
												onClick={() => {
													setNewAvatar('f2');
												}}>
												<Avatar
													sx={{
														width: 64,
														height: 64,
														border:
															newAvatar === 'f2' ? '2px solid green' : 'none',
													}}
													src={AvatarImgf2}
												/>
											</IconButton>
										</div>
										<div className='col'>
											<IconButton
												onClick={() => {
													setNewAvatar('f3');
												}}>
												<Avatar
													sx={{
														width: 64,
														height: 64,
														border:
															newAvatar === 'f3' ? '2px solid green' : 'none',
													}}
													src={AvatarImgf3}
												/>
											</IconButton>
										</div>
										<div className='col'>
											<IconButton
												onClick={() => {
													setNewAvatar('f4');
												}}>
												<Avatar
													sx={{
														width: 64,
														height: 64,
														border:
															newAvatar === 'f4' ? '2px solid green' : 'none',
													}}
													src={AvatarImgf4}
												/>
											</IconButton>
										</div>
									</div>

									<div className='row'>
										<div className='col'>
											<IconButton
												onClick={() => {
													setNewAvatar('m1');
												}}>
												<Avatar
													sx={{
														width: 64,
														height: 64,
														border:
															newAvatar === 'm1' ? '2px solid green' : 'none',
													}}
													src={AvatarImgm1}
												/>
											</IconButton>
										</div>
										<div className='col'>
											<IconButton
												onClick={() => {
													setNewAvatar('m2');
												}}>
												<Avatar
													sx={{
														width: 64,
														height: 64,
														border:
															newAvatar === 'm2' ? '2px solid green' : 'none',
													}}
													src={AvatarImgm2}
												/>
											</IconButton>
										</div>
										<div className='col'>
											<IconButton
												onClick={() => {
													setNewAvatar('m3');
												}}>
												<Avatar
													sx={{
														width: 64,
														height: 64,
														border:
															newAvatar === 'm3' ? '2px solid green' : 'none',
													}}
													src={AvatarImgm3}
												/>
											</IconButton>
										</div>
										<div className='col'>
											<IconButton
												onClick={() => {
													setNewAvatar('m4');
												}}>
												<Avatar
													sx={{
														width: 64,
														height: 64,
														border:
															newAvatar === 'm4' ? '2px solid green' : 'none',
													}}
													src={AvatarImgm4}
												/>
											</IconButton>
										</div>
									</div>
								</DialogContent>
								<DialogActions>
									<Button onClick={handleClose}>Close</Button>
									<Button onClick={updateAvatar} autoFocus>
										Confirm
									</Button>
								</DialogActions>
							</Dialog>
						</>
					)}
				</div>
				<div className='col-12 col-md-6 my-3 mt-md-0'>
					<div
						className='card mb-3 border-0 shadow'
						style={{
							backgroundImage:
								'linear-gradient(315deg, #e7eff9 0%, #cfd6e6 74%)',
						}}>
						<div className='card-body'>
							<div className='px-xl-3'>
								<Button
									startIcon={<AccountCircleIcon />}
									onClick={handleClickOpen}
									variant='contained'
									size='small'
									sx={{ mr: 4 }}>
									Update Avatar
								</Button>
								<Button
									variant='contained'
									size='small'
									color='warning'
									onClick={e => {
										ctx.logout();
									}}
									startIcon={<LogoutIcon />}>
									Log Out
								</Button>
							</div>
						</div>
					</div>
					<div
						className='card border-0 shadow py-2'
						style={{
							backgroundImage:
								'linear-gradient(315deg, #e7eff9 0%, #cfd6e6 74%)',
						}}>
						<div className='card-body'>
							<h6 className='card-title font-weight-bold'>Support</h6>
							<p className='card-text'>
								Get fast, free help from our friendly assistants.
							</p>
							<Button variant='contained' size='small' startIcon={<CallIcon />}>
								Contact Us
							</Button>
						</div>
					</div>
				</div>
			</div>
			{editMode && (
				<div className='row flex-lg-nowrap mt-4'>
					<div className='col'>
						<div className='row'>
							<div className='col-lg mb-3'>
								<div
									className='card border-0 shadow'
									style={{
										backgroundImage:
											'linear-gradient(315deg, #e7eff9 0%, #cfd6e6 74%)',
									}}>
									<div className='card-body'>
										<div className='e-profile'>
											<div className='row'>
												<div className='col d-flex flex-column flex-sm-row justify-content-between mb-3'>
													<div className='text-sm-right'>
														<div className='text-muted text-capitalize'>
															<small>
																Joined on{' '}
																{format(new Date(joined), 'dd MMM yyyy')}
															</small>
														</div>
														<h5 className='text-uppercase'>
															Billing &amp; Preferences
														</h5>
													</div>
												</div>
											</div>
											<div className='tab-pane active'>
												<form className='form' noValidate>
													<div className='row'>
														<Suspense>
															<UpdateBilling
																email={email}
																setEmail={setEmail}
															/>
														</Suspense>
													</div>
													<div className='row'>
														{!urlpath && (
															<Suspense>
																<UpdatePassword />
															</Suspense>
														)}
														{role !== 'admin' && !urlpath && (
															<Suspense>
																<MarketingSetting />
															</Suspense>
														)}
													</div>
												</form>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			)}
			<Backdrop
				sx={{
					color: '#000',
					zIndex: theme => theme.zIndex.drawer + 1,
					backdropFilter: 'blur(100px)',
					transitionDuration: '1s',
				}}
				open={isLoading}>
				<CircularProgress color='inherit' />
			</Backdrop>
		</>
	);
};

export default Profile;
