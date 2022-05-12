import {
	verifyToken,
	generateToken,
	hashPassword,
	getRoleCodes,
} from '../functions/util.js';
import { verifyEmail } from './sendMail.js';
import { findUser } from './user.js';

import dotenv from 'dotenv';
import pkg from '@prisma/client';
import { passwordvalidate } from '../functions/validate.js';
dotenv.config();
const { PrismaClient } = pkg;
const prisma = new PrismaClient();

const authenticateUser = (req, res, next) => {
	//get request token for authorization
	let usertoken = req.cookies.accessToken;
	if (!usertoken) {
		let err = new Error('No access token available');
		err.status = 403;
		next(err);
		return;
	} else {
		try {
			let user = verifyToken(usertoken, process.env.ACCESS_TOKEN_SECRET);
			req.user = user;
			next();
		} catch (e) {
			console.log(
				'🚀 ~ file: authenticate.js ~ line 24 ~ authenticateUser ~ e',
				e
			);
			res.status(403).send({ message: 'Auth Token invalid' });
		}
	}
};

const verifyLink = async ({ body: data }, res, next) => {
	let { verificationLink: token, verificationType } = data;
	//verifying email verification link
	if (verificationType === 'email') {
		try {
			let user = await prisma.users.findMany({
				where: {
					emailVerificationLink: token,
				},
				select: {
					email: true,
				},
			});
			let verify = verifyToken(token, process.env.EMAIL_VERIFICATION_SECRET);
			if (user[0].email && verify) {
				//activating account and removing jwt from the database
				await prisma.users.updateMany({
					where: {
						emailVerificationLink: token,
					},
					data: {
						emailVerificationLink: '',
						active: true,
					},
				});
				//success response
				console.log('Server side email verification successful');
				res.json({
					message: 'Email verified Successfully You can now Login!',
					status: 'success',
				});
			} else {
				console.log('Server Side email Verification unsuccesful');
				//Send error message because link has expired
				if (user[0].email && !verify) {
					res.json({ message: 'Link has expired', status: 'error' });
				}
				//Send error message because link was not found the database
				else {
					res.json({
						message: 'Verification link is not valid',
						status: 'error',
					});
				}
			}
		} catch (e) {
			console.log('Error message: ' + e.message, 'Error Stack: ' + e.stack);
			let err = new Error('Could not verify email');
			err.status = 500;
			next(err);
		}
	} else {
		//Verifying Password Reset Link
		try {
			var payload = verifyToken(token, process.env.RESET_PASSWORD_SECRET);
			res.json({
				status: 'success',
				message: 'verification successful',
				payload,
			});
		} catch (e) {
			next(new Error('Verification link has expired'));
		}
	}
};

const sendEmailVerification = async ({ username, email }) => {
	try {
		//creating a jwt for email verification : Expiration time  : 10min
		const verificationId = generateToken(
			{ username, email },
			process.env.EMAIL_VERIFICATION_SECRET,
			10 * 60
		);

		//send Email to with verification id to client
		verifyEmail(email, verificationId);

		//adding verificationId to database
		const updateUser = await prisma.users.update({
			where: {
				email,
			},
			data: {
				emailVerificationLink: verificationId,
			},
		});
		return updateUser;
	} catch (e) {
		console.log(
			'🚀 ~ file: sendMail.js ~ line 83 ~ sendEmailVerification ~ e',
			e
		);
	}
};

const logOutHandler = async (req, res, next) => {
	try {
		await prisma.users.update({
			where: {
				id: req.user.id,
			},
			data: {
				refreshToken: '',
			},
		});
		res.clearCookie('accessToken');
		res.clearCookie('refreshToken');
		res.clearCookie('isLoggedIn');
		res.clearCookie('role');
		res.status(200).send('logout successful');
	} catch (e) {
		console.log(e);
		let err = new Error('Error occurred while logging out!');
		err.status = 500;
		next(err);
	}
};

const getNewTokenHandler = async (req, res, next) => {
	//validate the incoming req token with the refresh token that is stored in the database
	//if it is valid then generate a new accessToken and return it else snd error status
	let { refreshToken } = req.cookie;

	if (!refreshToken) {
		console.log('No refresh Token');
		let err = new Error('Login Expired');
		err.status = 401;
		next(err);
		return;
	}
	try {
		let user = await prisma.users.findUnique({
			where: { refreshToken },
			select: { id: true },
		});

		let tokenPayload = verifyToken(
			refreshToken,
			process.env.REFRESH_TOKEN_SECRET
		);

		if (tokenPayload.id === user.id) {
			res.cookie('isLoggedIn', 'true', { maxAge: 36000000 });
			res.cookie('accessToken', accessToken, {
				httpOnly: true,
				maxAge: 36000000,
				//10 hours
			});
			res.cookie('role', getRoleCodes(tokenPayload.id), { maxAge: 36000000 });
			res.status(200).send({
				message: 'refresh token validation successful',
			});
		} else {
			res.clearCookie('refreshToken');
			res.status(401).send('Login expired');
		}
	} catch (e) {
		next(e);
	}
};
const updatePwd = async (req, res, next) => {
	let { password, newPassword } = req.body;
	let response;
	try {
		response = await findUser({ filter: 'id', value: req.user.id }, 'password');
	} catch (e) {
		let err = new Error('Error occurred while trying to update your password');
		err.status = 500;
		next(err);
	}

	if (!passwordvalidate(newPassword))
		res
			.status(400)
			.send(
				'Your password should contain atleast one number and one character'
			);
	else if (response.password !== password) {
		res.status(400).send('Your old Password was Incorrect!');
	} else {
		try {
			await prisma.users.update({
				where: {
					id: req.user.id,
				},
				data: {
					password: newPassword,
				},
			});
			res.status(200).send({
				message: 'Password updated successfully',
				username: req.user.username,
			});
		} catch (error) {
			console.error(error);
			res.status(500).send('Could not process your request try again later');
		}
	}
};

const updatePassword = async (req, res, next) => {
	const { updatedPassword, email } = req.body;
	if (!passwordvalidate(password))
		res.status(400).send('Password validation failed');
	try {
		let updatedRecord = await prisma.users.update({
			where: {
				email,
			},
			data: {
				password: updatedPassword,
			},
		});
		let { username } = updatedRecord;
		res.json({
			username,
			email,
			message: 'successfully updated password',
			status: 'success',
		});
	} catch (e) {
		next(e);
	}
};

const logInHandler = async (req, res, next) => {
	let user = req.body.userLogin;
	let isValidUser;
	//check if user exists in database
	try {
		isValidUser = await findUser(
			{ filter: 'email', value: user.email },
			'password',
			'id',
			'email',
			'username',
			'role'
		);
		if (!isValidUser) {
			let err = new Error(
				'Details not found in out database. Try registering instead'
			);
			err.status = 403;
			throw err;
		}
	} catch (e) {
		next(e);
	}
	//check if password matches the entered password and if true generate a refresh and access token
	if (isValidUser && isValidUser.password === user.password) {
		let accessToken;
		let refreshToken;
		let payload = {
			id: isValidUser.id,
			email: user.email,
			username: isValidUser.username,
			role: isValidUser.role,
		};
		try {
			accessToken = generateToken(
				payload,
				process.env.ACCESS_TOKEN_SECRET,
				36000000
			);
			//refresh token validity of 30 days.
			refreshToken = generateToken(
				payload,
				process.env.REFRESH_TOKEN_SECRET,
				2592000000
			);
		} catch (e) {
			next(e);
			return;
		}

		//storing the new refresh token in the database
		try {
			await prisma.users.update({
				where: {
					email: user.email,
				},
				data: {
					refreshToken,
				},
			});
			let code = getRoleCodes(isValidUser.role);
			//send refresh and access token to react client
			res.cookie('isLoggedIn', 'true', { maxAge: 36000000 });
			res.cookie('accessToken', accessToken, {
				httpOnly: true,
				maxAge: 36000000,
				//10 hours
			});
			//expires in 5 minutes
			res.cookie('refreshToken', refreshToken, {
				httpOnly: true,
				maxAge: 2592000000,
			}); //expires in 30 days
			res.cookie('role', code, { maxAge: 36000000 });
			res.status(200).send('Login Successful. Redirecting you to dashboard');
		} catch (err) {
			next(err);
		}
	} else {
		let err = new Error('Incorrect credentials');
		err.status = 400;
		next(err);
	}
};

export {
	logInHandler,
	updatePassword,
	getNewTokenHandler,
	logOutHandler,
	sendEmailVerification,
	verifyLink,
	authenticateUser,
	updatePwd,
};
