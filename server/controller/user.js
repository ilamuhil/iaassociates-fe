import pkg from '@prisma/client';
const { PrismaClient } = pkg;
import { sendEmailVerification } from './sendMail.js';
import {
	hashPassword,
	verifyToken,
} from '../functions/util.js';
import { emaxios, sendPaymentReminder } from './sendMail.js';
import isEmail from 'validator/lib/isEmail.js';
const prisma = new PrismaClient();
const addUserToDb = async ({ email, username, password, role = 'user' }) => {
	let newuser = await prisma.users.create({
		data: {
			email,
			username,
			password,
			role,
			marketingPreference: {
				create: {
					ServiceOffers: true,
					complianceInfo: true,
				},
			},
		},
	});
	return newuser;
};

const findUser = async (
	{ filter = 'id', role = 'user', multiple = 'false', value = '' },
	...args
) => {
	let data;
	if (multiple === 'false') {
		if (args.length === 0) {
			try {
				data = await prisma.users.findUnique({
					where: {
						[filter]: value,
					},
					select: {
						username: true,
						email: true,
						id: true,
						createdAt: true,
						role: true,
					},
				});
			} catch (e) {
				console.log(e);
				let err = new Error('Could not find requested user data');
				err.status = 500;
				throw err;
			}
		} else {
			let select = {};
			args.forEach(filter => {
				select = { ...select, [filter]: true };
			});

			try {
				data = await prisma.users.findUnique({
					where: {
						[filter]: value,
					},
					select,
				});
			} catch (e) {
				console.error(e);
				let err = new Error('Could not retrieve user data from id');
				err.status = 500;
				throw err;
			}
		}
	} else {
		if (role === 'user' || role === 'customer') {
			let err = new Error('Unathorized access');
			err.status = 403;
			throw err;
		} else {
			let select = {};
			if (args.length === 0) {
				select = { role: true, username: true, email: true, id: true };
			} else {
				args.forEach(e => {
					select = { ...select, [e]: true };
				});
			}
			try {
				data = await prisma.users.findMany({
					select,
				});
			} catch (e) {
				console.error(e);
				let err = new Error('Could not find the requested data');
				err.status = 500;
				throw err;
			}
		}
	}
	return data;
};
const findFilteredUser = async (req, res, next) => {
	let { filterkey, filterValue } = req.params;
	let select = [];
	for (const key in req.query) {
		select = [...select, key];
	}
	try {
		let user;
		if (filterkey) {
			if (filterkey === 'multiple' && req.user.role === 'admin') {
				user = await findUser({ [filterkey]: true, role: 'admin' }, ...select);
			} else {
				user = await findUser(
					{ filter: filterkey, value: filterValue },
					...select
				);
			}
		} else {
			user = await findUser({ filter: 'id', value: req.user.id }, ...select);
		}
		res.status(200).send(user);
	} catch (error) {
		console.error(error);
		let err = new Error('Could not find user');
		err.status = 500;
		next(err);
	}
};
const addToSib = async (username, email) => {
	try {
		let data = { email, listIds: [3, 4] };
		let resp = await emaxios.post('/contacts', data);
		return resp.data;
	} catch (error) {
		console.log('🚀 ~ file: user.js ~ line 124 ~ addToSib ~ error', error);
		let err = new Error('Could not add user to marketing list');
		err.status = 500;
		throw err;
	}
};
//parameter is an object which can contain any of the following properties => 'email' , 'username' , 'id'
const deleteUser = async (req, res) => {
	let {
		params: { idType, id },
	} = req;
	if (req.user.role !== 'admin') {
		res.status(403).send('This request is forbidden');
	} else {
		try {
			await prisma.users.delete({
				where: {
					[idType]: id,
				},
			});
			res.status(200).send('Successfully deleted user');
		} catch (e) {
			console.error(e);
			res.status(500), send('error occurred while trying to delete user');
		}
	}
};

const registerNewUser = async (
	{ body: { userRegister: newUser }, cookies },
	res,
	next
) => {
    console.log("🚀 ~ file: user.js ~ line 171 ~ cookies", cookies)
	if (Object.keys(cookies).length !== 0) {
		if (
			verifyToken(cookies.accessToken, process.env.ACCESS_TOKEN_SECRET).role ===
			'admin'
		)
			newUser = {
				...newUser,
				password: (Math.random() + 1).toString(36).substring(2),
			};
		else {
			res.status(403).send('Unauthorized Request');
		}
	}
	if (!isEmail(newUser.email))
		res.status(400).send('This is not a valid email');
	try {
		await addUserToDb(newUser);
		console.log('user added to db');
		await sendEmailVerification(newUser);
		//add user to sendInBlue account for marketing purposes
		await addToSib(newUser.username, newUser.email);
		console.log('Verification email sent and id added to db');
		res.status(200).send('Registration successful. Verify your email to login');
	} catch (e) {
		console.log('🚀 ~ file: user.js ~ line 169 ~ e', e);
		let err = new Error('Registration Unsuccessful');
		err.status = 500;
		next(err);
	}
};
const updateSibList = async (
	listId,
	params,
	endPoint = '',
	reqType = 'POST'
) => {
	const URL = `/contacts/lists/${listId}/${endPoint}`;
	if (reqType === 'POST') {
		try {
			await emaxios.post(URL, params);
			return;
		} catch (e) {
			console.error(e);
			let err = new Error("SendInBlue 'post' request Error");
			throw err;
		}
	} else {
		try {
			await emaxios.get(URL, { params });
		} catch (e) {
			console.error(e);
			let err = new Error("SendInBlue 'get' request Error");
			throw err;
		}
	}
};
const updateMarketing = async (req, res) => {
	let {
		body: { serviceOffers, complianceInfo },
		params: { id },
		user: { role },
	} = req;
	if (id && role !== 'admin') {
		res.status(403).send('Forbidden request');
	}
	id = id ? id : req.user.id;

	try {
		let user = await findUser(
			{ filter: 'id', value: id },
			'email',
			'marketingPreference'
		);
		let [serviceOfferPrefChanged, complianceInfoPrefChanged] = [
			user.marketingPreference.ServiceOffers !== serviceOffers,
			user.marketingPreference.complianceInfo !== complianceInfo,
		];
		if (serviceOfferPrefChanged || complianceInfoPrefChanged) {
			await prisma.users.update({
				where: {
					id,
				},
				data: {
					marketingPreference: {
						upsert: {
							create: {
								ServiceOffers: serviceOffers,
								complianceInfo,
							},
							update: {
								ServiceOffers: serviceOffers,
								complianceInfo,
							},
						},
					},
				},
			});

			let [sucMsg, errMsg] = ['Updated Preference', 'errMsg'];

			if (serviceOffers && serviceOfferPrefChanged) {
				try {
					await updateSibList(
						4,
						{
							emails: [user.email],
						},
						'contacts/add'
					);
				} catch (e) {
					console.log('🚀 ~ file: user.js ~ line 271 ~ updateMarketing ~ e', e);
					res.status(424).send(errMsg);
				}
			} else if (!serviceOffers && serviceOfferPrefChanged) {
				try {
					await updateSibList(
						4,
						{
							emails: [user.email],
						},
						'contacts/remove'
					);
				} catch (e) {
					console.log('🚀 ~ file: user.js ~ line 285 ~ updateMarketing ~ e', e);
					res.status(424).send(errMsg);
				}
			}
			if (complianceInfo && complianceInfoPrefChanged) {
				try {
					await updateSibList(
						3,
						{
							emails: [user.email],
						},
						'contacts/add'
					);
				} catch (e) {
					res.status(424).send(errMsg);
				}
			} else if (!complianceInfo && complianceInfoPrefChanged) {
				try {
					await updateSibList(
						3,
						{
							emails: [user.email],
						},
						'contacts/remove'
					);
				} catch (e) {
					res.status(424).send(errMsg);
				}
			}
			res.status(200).send(sucMsg);
		} else {
			res.status(200).send('success');
		}
	} catch (e) {
		res.status(500).send('Database error');
	}
};
const updateAvatar = async (req, res, next) => {
	if (req.params.id && req.user.role !== 'admin')
		res.status(403).send('Unauthorized request');
	let { avatar } = req.body;
	try {
		await prisma.users.update({
			where: {
				id: req.params.id ? req.params.id : req.user.id,
			},
			data: {
				avatar,
			},
		});
		res.status(200).send({ message: 'avatar updated successfully' });
	} catch (error) {
		let err = new Error('Error occurred while updating Avatar');
		err.status = 500;
		next(err);
	}
};

export {
	registerNewUser,
	findFilteredUser,
	findUser,
	deleteUser,
	addUserToDb,
	updateAvatar,
	updateMarketing,
};
