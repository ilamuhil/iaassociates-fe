import dotenv from 'dotenv';
dotenv.config();
import pkg from '@prisma/client';
const { PrismaClient } = pkg;
import { generateToken } from '../functions/util.js';
const prisma = new PrismaClient();
import axios from 'axios';

//email send via sendinblue axios instance setup
export const emaxios = axios.create({
	baseURL: 'https://api.sendinblue.com/v3',
	headers: {
		'api-key': process.env.SENDINBLUE_API_KEY,
		'content-type': 'application/json',
	},
});

const verifyEmail = async (username, toEmail, verificationId) => {
	try {
		emaxios.post('/smtp/email', {
			params: {
				confirmationLink: `${process.env.WEBSITE_URL}/verifyemail/${verificationId}`,
				name: username,
			},
			to: [{ name: username, email: toEmail }],
			templateId: 5,
		});
	} catch (e) {
		if (e.response) {
			console.error(e.response.data);
			let err = new Error('Could not send verification email.');
			err.status = 500;
			throw err;
		}
	}
};

const sendResetPasswordEmail = async (username, toEmail, verificationId) => {
	const verificationUrl = `${process.env.WEBSITE_URL}/update-password/${verificationId}`;
	try {
		emaxios.post('/smtp/email', {
			params: {
				confirmationLink: verificationUrl,
				name: username,
			},
			to: [{ name: username, email: toEmail }],
			templateId: 7,
		});
	} catch (e) {
		if (e.response) {
			console.error(e.response.data);
			let err = new Error('Could not send verification email.');
			err.status = 500;
			throw err;
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
		verifyEmail(username, email, verificationId);

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
		let err = new Error('Email could not be sent try again later');
		err.status = 500;
		throw err;
	}
};
const newOrderEmail = async (
	orderId,
	orderValue,
	serviceTitle,
	username,
	toEmail
) => {
	try {
		await emaxios.post('/smtp/email', {
			params: {
				orderValue,
				serviceTitle,
				orderNumber: orderId,
			},
			to: [{ name: username, email: toEmail }],
			templateId: 1,
		});
	} catch (e) {
		if (e.response) {
			console.error(e.response.data);
			let err = new Error('Could not send Order creation email.');
			err.status = 500;
			throw err;
		}
	}
};
const orderConfirmedEmail = async (
	serviceTitle,
	serviceDescription,
	orderValue,
	tax,
	orderDiscount,
	orderTotal,
	orderId,
	username,
	toEmail
) => {
	try {
		await emaxios.post('/smtp/email', {
			params: {
				orderValue,
				serviceTitle,
				orderNumber: orderId,
				serviceDescription,
				tax,
				orderDiscount,
				orderTotal,
			},
			to: [{ name: username, email: toEmail }],
			templateId: 3,
		});
	} catch (e) {
		if (e.response) {
			console.error(e.response.data);
			let err = new Error('Could not send Order creation email.');
			err.status = 500;
			throw err;
		}
	}
};
const orderRefundedEmail = async (
	serviceTitle,
	serviceDescription,
	orderValue,
	tax,
	orderDiscount,
	orderTotal,
	orderId,
	refundAmt,
	username,
	toEmail
) => {
	try {
		await emaxios.post('/smtp/email', {
			params: {
				orderValue,
				serviceTitle,
				orderNumber: orderId,
				serviceDescription,
				tax,
				orderDiscount,
				orderTotal,
				refundAmt,
			},
			to: [{ name: username, email: toEmail }],
			templateId: 3,
		});
	} catch (e) {
		if (e.response) {
			console.error(e.response.data);
			let err = new Error('Could not send Order creation email.');
			err.status = 500;
			throw err;
		}
	}
};
const contactEmail = async (name, email, phNo, service, message) => {
	try {
		await emaxios.post('/smtp/email', {
			params: {
				name,
				email,
				service,
				message,
				phNo,
			},
			to: [{ name: 'ilamurugu and associates', email: 'ilamuhil@gmail.com' }],
			templateId: 10,
		});
		await emaxios.post('/', {
			params: {
				name,
			},
			to: [{ name, email }],
			templateId: 9,
		});
	} catch (e) {
		console.error(e);
		let err = new Error('Could not send Contact email. Try again later');
		err.status = 500;
		throw err;
	}
};
const orderUpdateEmail = async (
	orderMessage = null,
	orderId,
	toEmail,
	username,
	orderStatus
) => {
	try {
		await emaxios.post('/smtp/email', {
			params: {
				orderNumber: orderId,
				orderStatus,
				...(orderMessage && { orderMessage }),
			},
			to: [{ name: username, email: toEmail }],
			templateId: 8,
		});
	} catch (e) {
		if (e.response) {
			console.error(e.response.data);
			let err = new Error('Could not send Order update email');
			err.status = 500;
			throw err;
		}
	}
};
export {
	sendEmailVerification,
	sendResetPasswordEmail,
	verifyEmail,
	orderConfirmedEmail,
	newOrderEmail,
	orderRefundedEmail,
	orderUpdateEmail,
	contactEmail,
};
