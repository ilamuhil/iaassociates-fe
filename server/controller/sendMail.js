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
const sendTemplatedEmail = async (
	params,
	to,
	id,
	errorMsg = 'Could not send email'
) => {
	try {
		emaxios.post('/smtp/email', {
			params,
			to,
			templateId: id,
		});
	} catch (e) {
		if (e.response) {
			console.error(e.response.data);
			let err = new Error(errorMsg);
			err.status = 500;
			throw err;
		}
	}
};
const sendPaymentReminder = async (username, orderId, email, amount) => {
	sendTemplatedEmail(
		{
			paymentLink: `${process.env.WEBSITE_URL}/dashboard/my-orders`,
			amount,
			id: orderId,
		},
		[{ name: username, email }],
		11,
		'Could not send payment reminder email'
	);
};

const verifyEmail = async (username, toEmail, verificationId) => {
	sendTemplatedEmail(
		{
			confirmationLink: `${process.env.WEBSITE_URL}/verifyemail/${verificationId}`,
			name: username,
		},
		[{ name: username, email: toEmail }],
		5,
		'Could not send verification email'
	);
};

const sendResetPasswordEmail = async (username, toEmail, verificationId) => {
	sendTemplatedEmail(
		{
			resetPasswordLink: `${process.env.WEBSITE_URL}/update-password/${verificationId}`,
			username,
		},
		[{ name: username, email: toEmail }],
		7
	);
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
	sendTemplatedEmail(
		{
			orderValue,
			serviceTitle,
			orderNumber: orderId,
		},
		[{ name: username, email: toEmail }],
		1,
		'Could not send Order Creation email'
	);
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
	sendTemplatedEmail(
		{
			orderValue,
			serviceTitle,
			orderNumber: orderId,
			serviceDescription,
			tax,
			orderDiscount,
			orderTotal,
		},
		[{ name: username, email: toEmail }],
		1,
		'Could not send Order Confirmation email'
	);
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
	sendTemplatedEmail(
		{
			orderValue,
			serviceTitle,
			orderNumber: orderId,
			serviceDescription,
			tax,
			orderDiscount,
			orderTotal,
			refundAmt,
		},
		[{ name: username, email: toEmail }],
		3,
		'Could not send Order Refunded email'
	);
};
const contactEmail = async (name, email, phNo, service, message) => {
	sendTemplatedEmail(
		{
			name,
			email,
			service,
			message,
			phNo,
		},
		[{ name: 'ilamurugu and associates', email: 'ilamuhil@gmail.com' }],
		10
	);
	sendTemplatedEmail(
		{
			name,
		},
		[{ name, email }],
		9,
		'Could not send Contact email. Try again later'
	);
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
	sendPaymentReminder,
};
