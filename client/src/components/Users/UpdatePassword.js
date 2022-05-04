import { useCallback, useContext, useState } from 'react';
import AuthContext from '../../context/AuthProvider';
import { toast } from 'react-toastify';
import { TextField, Button } from '@mui/material';

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
export default UpdatePassword;
