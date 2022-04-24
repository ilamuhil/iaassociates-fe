import { Button, TextField } from '@mui/material';
import React, { useCallback, useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SendIcon from '@mui/icons-material/Send';
import axios from './../api/axios';
const ResetPassword = ({ email }) => {
	const [password, setPassword] = useState('');
	const [confpassword, setconfPassword] = useState('');

	const submitForm = useCallback(async () => {
		if (password !== confpassword) {
			toast.info(' Your Passwords do not match');
		} else {
			//submit form
			const id = toast.loading('Updating Password');
			try {
				let response = await axios.post('updates/password', {
					updatedPassword: password,
					email,
				});
				toast.update(id, {
					render: response.data.message,
					type: 'success',
					isLoading: false,
					autoClose: 2000,
				});
				window.location.replace('/login');
			} catch (e) {
				console.log(e);
				toast.update(id, {
					render: 'Could not update your password, try again later',
					type: 'error',
					isLoading: true,
					autoClose: 2000,
				});
			}
		}
	}, [password, confpassword, email]);
	return (
		<>
			<form
				style={{
					marginTop: '30vh',
					boxShadow: '0px 0px 5px 3px rgba(0,0,0,0.1)',
					padding: '20px',
					display: 'flex',
					justifyContent: 'center',
					width: '50vw',
					marginInline: 'auto',
				}}
				onSubmit={submitForm}>
				<div className='row'>
					<div style={{ marginBottom: '1rem' }}>
						<TextField
							variant='filled'
							label='Password'
							size='small'
							type='password'
							onChange={e => {
								setPassword(e.target.value);
							}}
						/>
					</div>

					<div style={{ marginBottom: '1rem' }}>
						<TextField
							variant='filled'
							label='Confirm Password'
							size='small'
							type='password'
							onChange={e => {
								setconfPassword(e.target.value);
							}}
						/>
					</div>
					<div>
						<Button
							variant='contained'
							color='success'
							endIcon={<SendIcon />}
							onClick={() => {
								submitForm();
							}}>
							Confirm Changes
						</Button>
					</div>
				</div>
			</form>
		</>
	);
};

export default ResetPassword;
