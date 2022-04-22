import { Button } from '@mui/material';
import React, { useCallback, useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SendIcon from '@mui/icons-material/Send';
import axios from './../api/axios';
import { Navigate } from 'react-router-dom';
const ResetPassword = ({ email }) => {
	const [password, setPassword] = useState('');
	const [confpassword, setconfPassword] = useState('');
	const [successStatus, setSuccessStatus] = useState(false);
	const submitForm = useCallback(async () => {
		if (password !== confpassword) {
			toast.info(' Your Passwords do not match');
		} else {
			//submit form
			try {
				let response = await axios.post('updates/updatePassword', {
					updatedPassword: password,
					email,
				});
				if (response?.data.status === 'error') {
					toast.error(response.data.message);
				} else if (response?.data.status === 'success') {
					toast.success(response.data.message);
					setSuccessStatus(true);
				}
			} catch (e) {
				console.log(e);
				toast.error(
					'there was a problem while updating your password try again later'
				);
			}
		}
	}, [password, confpassword, email]);
	return (
		<>
			{ successStatus && <Navigate to="/login"/>}
			
			<form onSubmit={submitForm} >
				<label>New Password</label>
				<input
					type='password'
					onChange={e => {
						setPassword(e.target.value);
					}}
				/>
				<label>Confirm New Password</label>
				<input
					type='password'
					onChange={e => {
						setconfPassword(e.target.value);
					}}
				/>
				<Button
					variant='contained'
					onClick={() => {
						submitForm();
					}}
					endIcon={<SendIcon />}>
					Send
				</Button>
			</form>
			
		</>
	);
};

export default ResetPassword;
