import pkg from '@prisma/client';
import dotenv from 'dotenv';
import { newOrderEmail } from './sendMail.js';
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
		username,
		orderValue,
		discount,
		orderDescription,
		selectedService,
		email,
		invoiceNumber,
		addressId,
	} = req.body;
	try {
		//create an order at razorpay
		const order = await axios.post(
			'https://api.razorpay.com/v1/orders',
			{
				amount: Number(orderValue) * 100,
				currency: 'INR',
				receipt: invoiceNumber,
				notes: {
					key1: 'value3',
					key2: 'value2',
				},
				payment_capture: 1,
			},
			{
				auth: {
					username: process.env.RAZORPAY_CLIENT_ID,
					password: process.env.RAZORPAY_CLIENT_SECRET,
				},
			}
		);
		//add order details to database
		await prisma.users.update({
			data: {
				role: 'customer',
				orders: {
					create: {
						value: orderValue,
						discount,
						orderDescription,
						orderStatus: 'created',
						razorpayId: order.id,
						paymentStatus: 0,
						service: {
							connect: {
								title: serviceTitle,
							},
						},
						addressId,
					},
				},
			},
			where: {
				username,
			},
		});
		// 		value            Float
		//   createdAt        DateTime @default(now())
		//   serviceId        Int
		//   discount         Int
		//   orderDescription String   @db.LongText
		//   userId           String
		//   addressId        Int
		//   address          Address  @relation(fields: [addressId], references: [id])
		//   user             Users    @relation(fields: [userId], references: [id])
		//   service          Services @relation(fields: [serviceId], references: [id])
		//   review           Reviews?
		//   orderStatus      String   @db.MediumText
		//   paymentStatus    Boolean  @default(false)
		//   razorpay_id

		//send email to user to notify that an order has been created
		await newOrderEmail(orderId, orderValue, selectedService, username, email);
		// sample response
		// {
		// 	"id": "order_JGpJLlvQPT5mEU",
		// 	"entity": "order",
		// 	"amount": 354000,
		// 	"amount_paid": 0,
		// 	"amount_due": 354000,
		// 	"currency": "INR",
		// 	"receipt": "receipt#1",
		// 	"offer_id": null,
		// 	"status": "created",
		// 	"attempts": 0,
		// 	"notes": {
		// 	  "key1": "value3",
		// 	  "key2": "value2"
		// 	},
		// 	"created_at": 1649413187
		//   }
	} catch (e) {
		console.log(e);
		next(e);
	}
};
const getOrdersById = async (req, res, next) => {
	if (req.user.role !== 'admin') {
		let err = new Error('Unauthorized access');
		err.status = 403;
		next(err);
	}
	let { id } = req.params;
	id = parseInt(id);
	try {
		const data = await prisma.orders.findUnique({
			where: {
				id,
			},
			select: {
				service: {
					select: {
						id: true,
						title: true,
						SAC: true,
					},
				},
				address: true,
				value: true,
				discount: true,
				paymentStatus: true,
				createdAt: true,
				orderDescription: true,
			},
		});
		let responseData = {};
		for (key in data) {
			if (typeof data['key'] === 'object') {
				for (innerkey in data[key]) {
					responseData = { ...responseData, [innerkey]: data[key][innerkey] };
				}
			} else {
				responseData = { ...responseData, [key]: data[key] };
			}
		}
		responseData.phoneNo = responseData.phoneNo.toString();
		res.status(200).send(responseData);
	} catch (e) {
		let err = new Error('Could not retrieve order data from database!');
		err.status = 500;
		console.log(e);
		next(err);
	}
};

const getAllOrdersByUserRole = async (req, res, next) => {
	let data;
	if (req.user.role === 'user') {
		let err = new Error('Unauthorized request');
		err.status = 403;
		next(err);
	}
	let select = {
		service: {
			select: {
				title: true,
			},
		},
		user: {
			select: { username: true },
		},
		id: true,
		orderStatus: true,
		createdAt: true,
	};
	if (req.user.role === 'customer') {
		try {
			data = await Prisma.users.findMany({
				where: {
					id: req.user.id,
				},
				select,
			});
		} catch (e) {
			console.error(e);
			let err = new Error('could not retrieve orders data');
			err.status = 500;
			next(err);
		}
		//We assume role is admin and send back details of all orders
	} else {
		data = await prisma.orders.findMany({
			select,
		});
	}

	res.status(200).send(
		data.map(ele => {
			let { orderStatus: status, ...rest } = ele;
			return { ...rest, status };
		})
	);
};
const getOrderCount = async (req, res, next) => {
	let count;
	if (req.params.orderType === 'total') {
		count = await prisma.orders.count();
	} else {
		count = await Prisma.orders.count({
			where: {
				orderStatus: [req.params.orderType],
			},
		});
	}
};

export { getOrderCount, getAllOrdersByUserRole, getOrdersById, createNewOrder };
