import pkg from '@prisma/client';
import { request } from 'express';
import { sendEmailVerification } from './sendMail.js';
import { findUser } from './user.js';
const { PrismaClient } = pkg;
const prisma = new PrismaClient();
const getAddress = async (req, res, next) => {
	if (req.params.idType && req.user.role !== 'admin') {
		res.status(403).send('Unauthorized access');
	}
	const [idType, id] = req.params?.idType
		? [req.params.idType, req.params.id]
		: ['id', req.user.id];
	try {
		const addressRecord = await prisma.user.findUnique({
			where: {
				[idType]: id,
			},
			select: {
				address: true,
				orders: {
					select: {
						id: true,
					},
				},
			},
		});
		const { address } = addressRecord;
		address = { ...address, [idType]: id };
		res.status(200).send(address);
	} catch (e) {
		let err = new Error('Could not get Address');
		err.status = 500;
		next(err);
	}
};
//idType and id is optional parameter only to be used by admin
const updateAddress = async (req, res, next) => {
	const {
		email,
		adl1,
		adl2,
		state,
		city,
		fname,
		lname,
		invoiceType,
		zipcode,
		phoneNo,
	} = req.body;
	console.log(
		'🚀 ~ file: address.js ~ line 51 ~ updateAddress ~ req.body',
		req.body
	);
	if (req.params.idType) {
		if (req.user.role !== 'admin') {
			console.log(
				'🚀 ~ file: address.js ~ line 54 ~ updateAddress ~ req.user.role',
				req.user.role
			);
			let err = new Error('Unauthorized request');
			err.status = 403;
			next(err);
		}
	}
	let data = {
		address: {
			upsert: {
				create: {
					adl1,
					adl2,
					state,
					city,
					invoiceType,
					fName: fname,
					lName: lname,
					zipcode,
					phoneNo,
				},
				update: {
					adl1,
					adl2,
					state,
					city,
					invoiceType,
					fName: fname,
					lName: lname,
					zipcode,
					phoneNo,
				},
			},
		},
	};
	console.log('🚀 ~ file: address.js ~ line 88 ~ updateAddress ~ data ', data);
	let user;
	let userEmail;
	let resMsg = '';
	//gathering user data if the address change request is made by an admin
	if (req.user.role === 'admin') {
		user = await findUser({
			filter: 'id',
			value: req.params.id,
			role: 'admin',
		});
		userEmail = user.email;
	} else {
		userEmail = req.user.email;
	}
	console.log(
		'🚀 ~ file: address.js ~ line 102 ~ updateAddress ~ userEmail',
		userEmail
	);
	//checking if user with the new email already exists
	if (userEmail !== email) {
		let userAlreadyExists = await prisma.users.findUnique({
			where: {
				email,
			},
			rejectOnNotFound: false,
		});
		//send error message if true
		if (userAlreadyExists) {
			console.log(
				'🚀 ~ file: address.js ~ line 114 ~ updateAddress ~ userAlreadyExists',
				userAlreadyExists
			);
			res.status(400).send('The provided email has already been taken.');
		} else {
			data = { ...data, email, active: false };
			resMsg = 'Address updated. Check email to activate your account';
		}
	}
	const id = req.params.idType ? req.params.id : req.user.id;
	console.log('🚀 ~ file: address.js ~ line 122 ~ updateAddress ~ id', id);
	const idType = req.params.idType ? req.params.idType : 'id';
	try {
		await prisma.users.update({
			where: {
				[idType]: id,
			},
			data,
		});
		res
			.status(200)
			.send(resMsg ? resMsg : 'Address has been updated successfully');
	} catch (error) {
		console.log(
			'🚀 ~ file: address.js ~ line 135 ~ updateAddress ~ error',
			error
		);
		let err = new Error('Error occurred while trying to update address');
		err.status = 500;
		next(err);
	}
};
export { updateAddress, getAddress };
