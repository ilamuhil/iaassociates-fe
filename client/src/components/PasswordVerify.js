import { useParams, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import axios from './../api/axios';
import { Paper, Typography } from '@mui/material';

export const PasswordVerify = () => {
	const { verificationId } = useParams();
	const [resp, setResp] = useState('Validating Password Link...');
	let navigate = useNavigate();
	useEffect(() => {
		axios
			.post(
				'updates/resetPasswordRequest',
				{ verificationLink: verificationId },
				{ headers: { 'content-type': 'Application/json' } }
			)
			.then(response => {
				console.log(response);
				if (response.data.status.toLowerCase() === 'success') {
					setResp(`${response.data.message}. Redirecting you to Login Page...`);
					setTimeout(() => {
						navigate(`/login`);
					}, 3000);
					console.log('Email Verification Successful');
				} else if (response.data.status.toLowerCase() === 'error') {
					setResp(`${response.data.message}.`);
					setTimeout(() => {
						navigate(`/resetPassword`);
					}, 3000);
				} else {
					throw new Error('Some error has Occurred');
				}
			})
			.catch(error => {
				setResp('Some Error has occured. Try again Later');
				console.log(error);
			});
	}, [navigate, verificationId]);

	return (
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
			<Typography component='h2'>{resp}</Typography>
		</Paper>
	);
};
