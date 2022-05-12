import { useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import axios from '../../api/axios';
import ResetPassword from '../../pages/ResetPassword';
import { TextField, Paper, Button } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

export const EmailVerify = () => {
	const { verificationId } = useParams();
	const [resp, setResp] = useState('Verifying email...');
	useEffect(() => {
		axios
			.post(
				'authenticate/verifyLink',
				{ verificationLink: verificationId, verificationType: 'email' },
				{ headers: { 'content-type': 'Application/json' } }
			)
			.then(response => {
				console.log(response);
				if (response.data.status.toLowerCase() === 'success') {
					setResp(`${response.data.message}. Redirecting you to Login Page...`);
					setTimeout(() => {
						window.location.replace('/login');
					}, 3000);
					console.log('Email Verification Successful');
				} else if (response.data.status.toLowerCase() === 'error') {
					setResp(`${response.data.message}.`);
					setTimeout(() => {
						window.location.replace(`/login`);
					}, 3000);
				} else {
					throw new Error();
				}
			})
			.catch(error => {
				setResp('Some Error has occured. Try again Later');
				setTimeout(() => {
					window.location.replace(`/`);
				}, 3000);
				console.log(error);
			});
	}, [verificationId]);

	return <h5 style={{ marginTop: '50vh', textAlign: 'center' }}>{resp}</h5>;
};

export const PasswordVerify = () => {
	const { verificationId } = useParams();
	const [resp, setResp] = useState('Validating Password Link...');
	const [showForm, setShowForm] = useState(false);
	const [email, setEmail] = useState('');

	useEffect(() => {
		axios
			.post(
				'authenticate/verifyLink',
				{ verificationLink: verificationId, verificationType: 'password' },
				{ headers: { 'content-type': 'Application/json' } }
			)
			.then(response => {
				let { data } = response;
				if (data) {
					if (data?.status) {
						setEmail(response.data.payload.email);
						setResp(
							`${response.data.message}. Redirecting you to password reset page`
						);
						setTimeout(() => {
							setShowForm(true);
						}, 3000);
						console.log('Email Verification Successful');
					} else if (data.error) {
						setResp(`${response.data.error.message}.`);
						setTimeout(() => {
							window.location.href(`/login`);
						}, 3000);
					} else {
						throw new Error('Some error has occurred');
					}
				}
			})
			.catch(error => {
				setResp('Some Error has occured. Try again Later');
				console.log(error);
			});
	}, [verificationId]);

	return !showForm ? (
		<h5 style={{ marginTop: '50vh', textAlign: 'center' }}> {resp}</h5>
	) : (
		<ResetPassword email={email}></ResetPassword>
	);
};

export const PasswordResetEmail = () => {
	const [email, setEmail] = useState('');
	const [resp, setResp] = useState('');
	const submitForm = async () => {
		try {
			let response = await axios.post('updates/resetPasswordRequest', {
				email,
			});
			setResp(response.data?.message);
		} catch (e) {
			console.log(e);
			setResp('Some Error has occurred');
		}
	};
	return !resp ? (
		<Paper
			padding={4}
			sx={{
				minWidth: '350px',
				mx: 'auto',
				pt: 2,
				textAlign: 'center',
				background: '#ffffff',
				borderRadius: '5px',
				boxShadow: 'rgba(0, 0, 0, 0.75) 0px 16px 46px -22px',
				left: '50%',
				top: '50%',
				marginTop: '30vh',
				width: '40%',
				paddingBottom: '10px',
			}}>
			<TextField
				id='outlined-helperText'
				label='Email'
				helperText='If your Email Address exists in our database you will receive a password reset link'
				onChange={e => {
					setEmail(e.target.value);
				}}
				sx={{ mx: 4, width: '80%' }}
				variant='standard'
			/>
			<Button
				variant='contained'
				onClick={() => {
					submitForm();
				}}
				sx={{ width: '80%', mx: 4, my: 2 }}
				endIcon={<SendIcon />}>
				Send
			</Button>
		</Paper>
	) : (
		<h5 style={{ marginTop: '50vh', textAlign: 'center' }}> {resp}</h5>
	);
};
