import {
	Avatar,
	Box,
	Button,
	Card,
	CardActions,
	CardContent,
	Divider,
	Typography,
	TextField,
	FormGroup,
	FormControlLabel,
	Checkbox,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	IconButton,
} from '@mui/material';
import AvatarImgf1 from './../img/avatar/avatarf1.png';
import AvatarImgf2 from './../img/avatar/avatarf2.png';
import AvatarImgf3 from './../img/avatar/avatarf3.png';
import AvatarImgf4 from './../img/avatar/avatarf4.png';
import AvatarImgm1 from './../img/avatar/avatarm1.png';
import AvatarImgm2 from './../img/avatar/avatarm2.png';
import AvatarImgm3 from './../img/avatar/avatarm3.png';
import AvatarImgm4 from './../img/avatar/avatarm4.png';
import { useState, useEffect, useCallback, useContext } from 'react';
import LogoutIcon from '@mui/icons-material/Logout';
import { toast } from 'react-toastify';
import AuthContext from '../context/AuthProvider';
import { useParams } from 'react-router-dom';
import { format } from 'date-fns';

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
	const [companyInvoice, setCompanyInvoice] = useState(true);
	const [fname, setFname] = useState('');
	const [lname, setLname] = useState('');
	const [phoneNo, setPhoneNo] = useState('');
	const [adl1, setAdl1] = useState('');
	const [adl2, setAdl2] = useState('');
	const [city, setCity] = useState('');
	const [state, setState] = useState('');
	const [zipcode, setZipcode] = useState(0);
	const [open, setOpen] = useState(false);
	const axiosPvt = ctx.useAxiosPrivate();
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
		return () => {
			controller.abort();
		};
	}, [axiosPvt, selectAvatar, urlpath]);

	const updateAvatar = useCallback(() => {
		const payload = { avatar: newAvatar };
		const toastId = toast.loading('Updating Avatar...');
		selectAvatar();
		axiosPvt
			.put('user/avatar', payload)
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
	}, [newAvatar, selectAvatar, axiosPvt]);

	const updateBilling = useCallback(() => {
		const invoiceType = companyInvoice ? 'company' : 'personal';
		let payload = {
			adl1,
			adl2,
			zipcode,
			city,
			state,
			fname,
			lname,
			email,
			phoneNo,
			invoiceType,
		};
		console.log(typeof zipcode);

		const url = urlpath
			? `/addresses/billingDetails/id/${urlpath}`
			: '/addresses/billingDetails';
		const toastid = toast.loading('Processing request');
		axiosPvt
			.post(url, payload)
			.then(res => {
				toast.update(toastid, {
					render: res.data.message,
					type: 'success',
					isLoading: false,
					autoClose: 1000,
				});
			})
			.catch(err => {
				if (err.response) {
					toast.update(toastid, {
						render: err.response.data,
						type: 'error',
						isLoading: false,
						autoClose: 2000,
					});
				} else {
					console.error(err.request);
					toast.update(toastid, {
						render: 'Server Unavailable.Try again later',
						type: 'error',
						isLoading: false,
						autoClose: 2000,
					});
				}
			});
	}, [
		adl1,
		email,
		adl2,
		zipcode,
		state,
		city,
		phoneNo,
		fname,
		lname,
		companyInvoice,
		axiosPvt,
		urlpath,
	]);
	return (
		<>
			<div className='row'>
				<div className='col-md-6 col-lg-4'>
					{username && (
						<>
							<Card
								{...props}
								style={{
									backgroundImage:
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
										{role !== 'user' && role !== 'admin' && (
											<Typography color='textSecondary' variant='body2'>
												{`${city} ${state}`}
											</Typography>
										)}
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
							<Button variant='contained' size='small'>
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
														<div className='col'>
															<div className='row mb-2'>
																<div className='col'>
																	<div className='form-group'>
																		<TextField
																			value={fname}
																			onChange={e => {
																				setFname(e.target.value);
																			}}
																			fullWidth
																			id='first name'
																			label={
																				!companyInvoice
																					? 'First Name'
																					: 'Company/Firm Name'
																			}
																			variant='standard'
																		/>
																	</div>
																</div>
																<div className='col'>
																	<div className='form-group'>
																		<TextField
																			value={lname}
																			onChange={e => {
																				setLname(e.target.value);
																			}}
																			fullWidth
																			id='last name'
																			label={
																				!companyInvoice ? 'Last Name' : 'GSTIN'
																			}
																			variant='standard'
																		/>
																	</div>
																</div>
															</div>
															<div className='row mb-2'>
																<div className='col'>
																	<div className='form-group'>
																		<TextField
																			value={email}
																			onChange={e => {
																				setEmail(e.target.value);
																			}}
																			fullWidth
																			id='email'
																			label='email'
																			variant='standard'
																		/>
																	</div>
																</div>
																<div className='col'>
																	<div className='form-group'>
																		<TextField
																			value={phoneNo}
																			onChange={e => {
																				setPhoneNo(e.target.value);
																			}}
																			fullWidth
																			id='Phone Number'
																			label='Phone Number'
																			variant='standard'
																		/>
																	</div>
																</div>
															</div>
															<div className='row'>
																<div className='col-lg-6 mb-3'>
																	<div className='form-group'>
																		<TextField
																			value={adl1}
																			onChange={e => {
																				setAdl1(e.target.value);
																			}}
																			fullWidth
																			id='address line 1'
																			label='address line 1'
																			variant='standard'
																		/>
																	</div>
																</div>
																<div className='col-lg-6 mb-3'>
																	<div className='form-group'>
																		<TextField
																			value={adl2}
																			onChange={e => {
																				setAdl2(e.target.value);
																			}}
																			fullWidth
																			id='address line 2'
																			label='address line 2'
																			variant='standard'
																		/>
																	</div>
																</div>
															</div>
															<div className='row'>
																<div className='col-lg-6 mb-3'>
																	<div className='form-group'>
																		<TextField
																			value={city}
																			onChange={e => {
																				setCity(e.target.value);
																			}}
																			fullWidth
																			id='city'
																			label='city'
																			variant='standard'
																		/>
																	</div>
																</div>
																<div className='col-lg-6 mb-3'>
																	<div className='form-group'>
																		<TextField
																			value={state}
																			onChange={e => {
																				setState(e.target.value);
																			}}
																			fullWidth
																			id='state'
																			label='state'
																			variant='standard'
																		/>
																	</div>
																</div>
															</div>
															<div className='row'>
																<div className='col-lg-6 mb-3'>
																	<FormControlLabel
																		control={
																			<Checkbox
																				checked={companyInvoice}
																				size='small'
																				onChange={e => {
																					setCompanyInvoice(e.target.checked);
																				}}
																			/>
																		}
																		label='Company Invoice'
																	/>
																</div>
																<div className='col-lg-6 mb-3'>
																	<div className='form-group'>
																		<TextField
																			fullWidth
																			id='zipcode'
																			type='number'
																			label='zipcode'
																			variant='standard'
																			value={zipcode}
																			onChange={e => {
																				setZipcode(parseInt(e.target.value));
																			}}
																		/>
																	</div>
																</div>
															</div>
															<div className='row mb-4'>
																<div className='col-lg-6 mb-3'>
																	<Button
																		color='warning'
																		variant='contained'
																		size='small'
																		onClick={updateBilling}>
																		Update Billing Info
																	</Button>
																</div>
																<div className='col-lg-6'></div>
															</div>
														</div>
													</div>
													<div className='row'>
														{!urlpath && <UpdatePassword />}
														{role !== 'admin' && !urlpath && (
															<MarketingSetting />
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
		</>
	);
};

function MarketingSetting() {
	const ctx = useContext(AuthContext);
	const axiosPvt = ctx.useAxiosPrivate();
	const [serviceOffers, setServiceOffers] = useState(true);
	const [complianceInfo, setComplianceInfo] = useState(true);
	const { id: urlpath } = useParams();
	useEffect(() => {
		const controller = new AbortController();
		axiosPvt
			.get('/user', {
				params: {
					marketingPreference: true,
				},
				signal: controller.signal,
			})
			.then(
				({
					data: {
						marketingPreference: { ServiceOffers: so, complianceInfo: ci },
					},
				}) => {
					setServiceOffers(so);
					setComplianceInfo(ci);
				}
			)
			.catch(e => {
				if (e?.response) {
					toast.error(e.respose.data);
				} else {
					toast.error('Could not retrieve marketing data. Server unavailable');
				}
			});
		return () => {
			controller.abort();
		};
	}, [axiosPvt]);
	const updateMarketingSetting = useCallback(() => {
		toast.promise(
			axiosPvt.post(`/user/marketing/${urlpath ? urlpath : ''}`, {
				serviceOffers,
				complianceInfo,
			}),
			{
				pending: 'Updating your settings preference',
				success: 'Successfully updated preference ✓',
				error: 'Could not update your preference. Try again later',
			}
		);
	}, [axiosPvt, complianceInfo, serviceOffers, urlpath]);
	return (
		<div className='col-12 col-sm-5 mb-3'>
			<div className='row mb-4'>
				<div className='col'>
					<div className='custom-controls-stacked pr-2'>
						<FormGroup>
							<div className='mb-2'>
								<b>Email Notification Settings</b>
							</div>
							<FormControlLabel
								control={
									<Checkbox
										size='small'
										checked={complianceInfo}
										onChange={() => {
											setComplianceInfo(p => !p);
										}}
									/>
								}
								label='Compliance Info and Deadlines'
							/>
							<FormControlLabel
								control={
									<Checkbox
										size='small'
										checked={serviceOffers}
										onChange={() => {
											setServiceOffers(p => !p);
										}}
									/>
								}
								label='Occassional Service Discounts and Offers'
							/>
							<FormControlLabel
								control={<Checkbox size='small' checked={true} />}
								label='My Service Updates'
							/>
						</FormGroup>
					</div>
				</div>
			</div>
			<div className='row'>
				<div className='col'>
					<Button
						variant='contained'
						size='small'
						color='warning'
						onClick={updateMarketingSetting}>
						Update Email Settings
					</Button>
				</div>
			</div>
		</div>
	);
}

function UpdatePassword() {
	const [pwd, setPwd] = useState('');
	const [confNewPwd, setConfNewPwd] = useState('');
	const [newPwd, setNewPwd] = useState('');
	const ctx = useContext(AuthContext);
	const axiosPvt = ctx.useAxiosPrivate();
	const updatePasswordHandler = useCallback(() => {
		if (confNewPwd !== newPwd) {
			toast.warn('Your new passwords do not match');
			return;
		}
		const toastid = toast.loading('Processing request');
		axiosPvt
			.put('/updates/updatePwd', { password: pwd, newPassword: newPwd })
			.then(res => {
				console.log(res.data.message);
				toast.update(toastid, {
					render: res.data.message,
					type: 'success',
					isLoading: false,
					autoClose: 2000,
				});
			})
			.catch(err => {
				if (err.response) {
					toast.update(toastid, {
						render: err.response.data,
						type: 'error',
						isLoading: false,
						autoClose: 2000,
					});
				} else {
					console.error(err.request);
					toast.update(toastid, {
						render: 'Server Unavailable.Try again later',
						type: 'error',
						isLoading: false,
						autoClose: 2000,
					});
				}
			});
	}, [confNewPwd, newPwd, pwd, axiosPvt]);
	return (
		<div className='col-12 col-sm-6 mb-3'>
			<div className='mb-2'>
				<b>Change Password</b>
			</div>
			<div className='row mb-2'>
				<div className='col'>
					<div className='form-group'>
						<TextField
							onChange={e => {
								setPwd(e.target.value);
							}}
							fullWidth
							id='Current Password'
							label='Current Password'
							variant='standard'
							type='password'
						/>
					</div>
				</div>
			</div>
			<div className='row mb-2'>
				<div className='col'>
					<div className='form-group'>
						<TextField
							onChange={e => {
								setNewPwd(e.target.value);
							}}
							fullWidth
							id='New Password'
							label='New Password'
							variant='standard'
							type='password'
						/>
					</div>
				</div>
			</div>
			<div className='row mb-4'>
				<div className='col'>
					<div className='form-group'>
						<TextField
							onChange={e => {
								setConfNewPwd(e.target.value);
							}}
							fullWidth
							id='Confirm Password'
							label='Confirm Password'
							variant='standard'
							type='password'
						/>
					</div>
				</div>
			</div>
			<div className='row'>
				<div className='col'>
					<Button
						variant='contained'
						size='small'
						color='warning'
						onClick={updatePasswordHandler}>
						Update Password
					</Button>
				</div>
			</div>
		</div>
	);
}
export default Profile;
