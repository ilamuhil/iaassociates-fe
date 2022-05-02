import axios from 'axios';
import pkg from '@prisma/client';
const { PrismaClient } = pkg;
const prisma = new PrismaClient();

const rpaxios = axios.create({
	baseURL: 'https://api.razorpay.com/v1',
	auth: {
		username: process.env.RAZORPAY_CLIENT_ID,
		password: process.env.RAZORPAY_CLIENT_SECRET,
	},
});
const flattenOrders = orders => {
	return (orders = orders.map(order => {
		let { user, service, ...rest } = order;
		order = { ...rest, ...user, ...service };
		return order;
	}));
};

const getfilteredOrders = async (role, filter, idType = '', id = '') => {
	if (role === 'user') {
		let err = new Error('No orders found');
		err.status = 400;
		return Promise.reject(err);
	}
	if (idType) {
		try {
			let orders = await prisma.orders.findMany({
				where: {
					user: {
						[idType]: id,
					},
					...filter,
				},
				include: {
					service: {
						select: { title: true },
					},
					user: {
						select: {
							username: true,
							email: true,
						},
					},
				},
			});
			return flattenOrders(orders);
		} catch (e) {
			console.error(e);
			let err = new Error('Could not find orders');
			err.status = 401;
			Promise.reject(err);
		}
	} else {
		if (role !== 'admin') {
			let err = new Error('Unauthorized Request');
			err.status = 401;
			return Promise.reject(err);
		} else {
			try {
				let orders = await prisma.orders.findMany({
					where: filter,
					include: {
						user: {
							select: { username: true, email: true },
						},
						service: {
							select: { title: true },
						},
					},
				});
				return flattenOrders(orders);
			} catch (e) {
				console.error(e);
				let err = new Error('Could not get orders');
				err.status = 500;
				return Promise.reject(err);
			}
		}
	}
};

const getAllOrders = async (role, idType = '', id = '') => {
	if (role === 'user') {
		let err = new Error('No orders found');
		err.status = 400;
		return Promise.reject(err);
	}
	if (idType) {
		try {
			let orders = await prisma.orders.findMany({
				where: {
					user: {
						[idType]: id,
					},
				},
				include: {
					user: {
						select: { username: true, email: true },
					},
					service: {
						select: {
							title: true,
						},
					},
				},
			});
			return flattenOrders(orders);
		} catch (e) {
			let err = new Error('Could not get orders data');
			err.status = 500;
			return Promise.reject(err);
		}
	} else {
		if (role === 'admin') {
			try {
				let orders = await prisma.orders.findMany({
					include: {
						user: {
							select: {
								username: true,
								email: true,
							},
						},
						service: {
							select: {
								title: true,
							},
						},
					},
				});
				return flattenOrders(orders);
			} catch (e) {
				let err = new Error('Could not get orders data');
				err.status = 500;
				return Promise.reject(err);
			}
		} else {
			let err = new Error('Unauthorized Request');
			err.status = 401;
			return Promise.reject(err);
		}
	}
};
export {getAllOrders,getfilteredOrders,rpaxios}