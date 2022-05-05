import pkg from '@prisma/client';
import dotenv from 'dotenv';
import { createHmac } from 'crypto';
import {
	newOrderEmail,
	orderUpdateEmail,
	orderRefundedEmail,
} from './sendMail.js';
import {
	getAllOrders,
	getfilteredOrders,
	rpaxios,
} from './../functions/orderhelpers.js';
const { PrismaClient } = pkg;
const prisma = new PrismaClient();
dotenv.config();

const createNewOrder = async (req, res, next) => {
	if (req.user.role !== 'admin') {
		let err = new Error('Unauthorized access');
		err.status = 403;
		next(err);
	}
	let {
		body: {
			username,
			discount,
			orderDescription,
			serviceId,
			invoiceNumber,
			invoiceDate,
			orderValue,
			orderNotes,
		},
	} = req;
	invoiceDate = new Date(invoiceDate);
	try {
		//create an order at razorpay
		let order = await rpaxios.post('/orders', {
			amount: orderValue * 100,
			currency: 'INR',
			receipt: invoiceNumber,
			notes: {
				orderNotes,
			},
			payment_capture: 1,
		});
		console.log(order.data);

		//add order details to database
		let neworder = await prisma.orders.create({
			data: {
				value: orderValue,
				discount,
				orderDescription,
				orderStatus: 'created',
				razorpayId: order.data.id,
				paymentStatus: false,
				invoiceNumber,
				invoiceDate: invoiceDate.toISOString(),
				user: {
					connect: {
						username,
					},
				},
				service: {
					connect: { id: serviceId },
				},
			},
			include: {
				service: {
					select: {
						title: true,
					},
				},
				user: {
					select: { email: true },
				},
			},
		});
		await prisma.users.update({
			where: {
				username,
			},
			data: {
				role: 'customer',
			},
		});
		let {
			id: orderId,
			user: { email },
			service: { title },
			value,
		} = neworder;
		await newOrderEmail(orderId, value, title, username, email);
		console.log('email sent');
		res.status(200).send('Order created successfully');
	} catch (e) {
		console.log(e);
		next(e);
	}
};

const updateOrder = async ({ user: { role }, body, params: { id } }, res) => {
	if (role !== 'admin') res.status(403).send('Unauthorized request');
	let data;
	let update = { orderStatus: body.orderStatus };
	update = body.orderNotes
		? { ...update, orderNotes: body.orderNotes }
		: update;

	try {
		data = await prisma.orders.update({
			where: {
				id,
			},
			data: update,
		});
	} catch (error) {
		console.log(error);
		res.status(500).send('An unknown error occurred');
	}
	if (body.sendMail) {
		try {
			let user = await prisma.orders.findUnique({
				where: { id },
				include: {
					user: {
						select: {
							username: true,
							email: true,
						},
					},
				},
			});
			let { username, email } = user.user;
			await orderUpdateEmail(
				body.orderNotes,
				body.id,
				email,
				username,
				body.orderStatus
			);
			res.status(200).send('Updated Order successfully. Email sent to user');
		} catch (e) {
			res.status(500).send('Could not send order update email');
		}
	} else {
		res.status(200).send('Updated order in the database');
	}
};

const refundOrder = async (req, res) => {
	let { refundAmt, speed, receiptNumber } = req.body;
	let { orderId } = req.params;
	//update Database
	try {
		let order = await prisma.orders.update({
			where: {
				id: parseInt(orderId),
			},
			data: {
				orderStatus: 'refunded',
			},
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
		let {
			razorpayPaymentId,
			value,
			user: { username, email },
			service: { title },
			discount,
			orderDescription,
		} = order;
		discount = discount + '%' || 'NA';
		let payload = { amount: parseFloat(refundAmt) * 100, speed };
		//make refund request to razorpay
		payload = receiptNumber ? { ...payload, receipt: receiptNumber } : payload;
		let res = await rpaxios.post(
			`/payments/${razorpayPaymentId}/refund`,
			payload
		);
		//send refund email to user
		await orderRefundedEmail(
			title,
			orderDescription,
			value,
			'18%',
			discount,
			value,
			id,
			refundAmt,
			username,
			email
		);
		res
			.status(200)
			.send(`Refund of amount ${refundAmt} sent for processing at razorpay`);
	} catch (e) {
		console.log(e);
		console.log(e?.response);
		console.log(e?.response?.data);
		res.status(500).send('Could not process your refund request');
	}
};

const getOrders = async (
	{ params: { idType, id }, query, user },
	res,
	next
) => {
	//TODO if nothing is provided return all orders (if admin return all orders and if user return all orders of that user)
	if (Object.keys(query).length === 0) {
		if (idType) {
			try {
				if (user.role !== 'admin') {
					res.status(403).send('Unauthorized request');
				} else {
					let data = await getAllOrders(user.role, idType, id);
					res.status(200).send(data);
				}
			} catch (e) {
				next(e);
			}
		} else {
			try {
				if (user.role === 'admin') {
					let data = await getAllOrders('admin');
					res.status(200).send(data);
				} else {
					let data = await getAllOrders(user.role, 'id', user.id);
					res.status(200).send(data);
				}
			} catch (e) {
				next(e);
			}
		}
	} else {
		if (query?.paymentStatus && query?.orderStatus) {
			if (
				query.paymentStatus &&
				['created', 'refunded', 'failed'].includes(query.orderStatus)
			) {
				let err = new Error('No orders exist with this filter');
				err.status = 400;
				next(err);
			}
		}
		try {
			if (query?.paymentStatus) {
				query.paymentStatus = query.paymentStatus === 'true' ? true : false;
			}
			if (idType) {
				let data = await getfilteredOrders(user.role, query, idType, id);
				res.status(200).send(data);
			} else {
				if (user.role === 'admin') {
					let data = await getfilteredOrders(user.role, query);
					res.status(200).send(data);
				} else {
					let data = await getfilteredOrders(user.role, query, 'id', user.id);
					res.status(200).send(data);
				}
			}
		} catch (e) {
			next(e);
		}
	}
};

const getSingleOrderSummary = async (
	{ params: { id }, user: { role, id: userId } },
	res
) => {
	let data = await prisma.orders.findUnique({
		where: { id: Number(id) },
		select: {
			user: {
				select: {
					address: true,
					email: true,
					id: true,
				},
			},
			id: true,
			value: true,
			createdAt: true,
			discount: true,
			orderDescription: true,
			invoiceNumber: true,
			orderStatus: true,
			paymentStatus: true,
			invoiceDate: true,
			service: {
				select: {
					title: true,
					SAC: true,
				},
			},
		},
	});
	if (role === 'admin') {
		res.status(200).send(data);
	} else if (role === 'customer') {
		if (userId !== data.user.id) res.status(403).send('Unauthorized');
		else res.status(200).send(data);
	} else {
		res.status(403).send('Unauthorized');
	}
};

const getOrderCount = async (req, res, next) => {
	let count;
	if (req.params.orderType === 'total') {
		count = await prisma.orders.count();
	} else {
		count = await prisma.orders.count({
			where: {
				orderStatus: [req.params.orderType],
			},
		});
	}
};

const getEditableOrders = async (req, res) => {
	if (req.user.role !== 'admin') res.status(403).send('Unauthorized request');
	let data = await prisma.orders.findMany({
		where: {
			orderStatus: {
				in: ['pending', 'onhold'],
			},
		},
		select: { id: true },
	});
	res.status(200).send(data);
};

//this is a monthly report for admin to download json data
const getOrdersByMonth = async (
	{ params: { month }, user: { role } },
	res,
	next
) => {
	if (role !== 'admin') res.status(403).send('Unauthorized');
	try {
		console.log(month);
		let d = new Date();
		let year = d.getFullYear();
		let data = await prisma.orders.findMany({
			where: {
				AND: [
					{
						createdAt: {
							gte: new Date(year, Number(month), 1),
						},
					},
					{ createdAt: { lt: new Date(year, Number(month) + 1, 1) } },
				],
			},
			include: {
				user: {
					select: {
						address: true,
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

		//make modifications to the orders data based on invoice type and flatten the results
		let orders = data
			.map(order => {
				if (order.user.address.invoiceType === 'company') {
					order.user.address.GSTIN = order.user.address.lName;
					order.user.address.companyName = order.user.address.fName;
					delete order.user.address.fName;
					delete order.user.address.lName;
					delete order.user.address.id;
					delete order.userId;
				}
				let {
					user: { address, email },
					service,
					...rest
				} = order;
				order = { ...rest, ...service, ...address, email };
				return order;
			})
			.sort((a, b) => {
				if (a.createdAt >= b.createdAt) return 1;
				return -1;
			});
		if (orders.length === 0)
			res.status(400).send('No orders found for the selected month');
		res.status(200).send(orders);
	} catch (e) {
		console.log(e, 'Error');
		let err = new Error('Could not fetch Data');
		err.status = 500;
		next(err);
	}
};

const deleteOrder = async (req, res) => {
	let { id } = req.params;
	try {
		await prisma.orders.delete({ where: { id: Number(id) } });
		res.sendStatus(200);
	} catch (e) {
		console.error(e);
		res.sendStatus(500);
	}
};

export {
	getOrderCount,
	createNewOrder,
	getOrders,
	getOrdersByMonth,
	getEditableOrders,
	refundOrder,
	updateOrder,
	getSingleOrderSummary,
	deleteOrder,
};
