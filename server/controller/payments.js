import pkg from '@prisma/client';
import { rpaxios } from './../functions/orderhelpers.js';
import { sendPaymentReminder, orderConfirmedEmail } from './sendMail.js';
import { createHmac } from 'crypto';
const { PrismaClient } = pkg;
const prisma = new PrismaClient();

const paymentReminder = async (req, res, next) => {
	let data = await prisma.orders.findUnique({
		where: { id: req.body.orderId },
		select: {
			value: true,
			user: {
				select: {
					username: true,
				},
			},
		},
	});
	try {
		sendPaymentReminder(
			data.user.username,
			req.body.orderId,
			req.body.email,
			data.value
		);
		res.status(200).send('Payment reminder sent');
	} catch (error) {
		console.log(error);
		next(error);
	}
};

const sendPaymentLink = async (req, res) => {
	let { amount, upi_link, username, email, phone } = req.body;
	let payload = {
		amount: parseFloat(amount) * 100,
		upi_link,
		customer: { name: username, email },
	};
	payload = phone
		? {
				...payload,
				customer: { ...payload.customer, contact: phone },
				notify: { email: true, sms: true },
		  }
		: { ...payload, notify: { email: true } };
	try {
		await rpaxios.post('/payment_links', payload);
		res.status(200).send('Sent payment link successfully to user');
	} catch (e) {
		console.log(e?.response.data || e);
		res.status(500).send('Could not send payment link to user');
	}
};

const retryPayment = async (req, res) => {
	let { id } = req.body;
	let order = await prisma.orders.findUnique({
		where: {
			id,
		},
		select: {
			value: true,
			orderNotes: true,
			invoiceNumber: true,
		},
	});
	let updateRpOrder = await rpaxios.post('/orders', {
		amount: order.value * 100,
		currency: 'INR',
		receipt: order.invoiceNumber || 'NA',
		notes: {
			orderNotes: order.orderNotes,
		},
		payment_capture: 1,
	});
	await prisma.orders.update({
		where: {
			id,
		},
		data: {
			razorpayId: updateRpOrder.id,
		},
	});
	res.status(200).send({ razorpayId: updateRpOrder.id });
};

const paymentVerification = async (req, res) => {
	try {
		// getting the details back from our font-end
		const {
			orderCreationId,
			razorpayPaymentId,
			razorpayOrderId,
			razorpaySignature,
		} = req.body;
		const { id } = req.params;
		const digest = createHmac('sha256', process.env.RAZORPAY_CLIENT_SECRET)
			.update(`${orderCreationId}|${razorpayPaymentId}`)
			.digest('hex');
		if (digest !== razorpaySignature) {
			try {
				await prisma.orders.update({
					where: {
						razorpayId: razorpayOrderId,
					},
					data: {
						orderStatus: 'failed',
					},
				});
			} catch (e) {
				console.log('could not update database', e);
			} finally {
				res.status(400).json("Oops we couldn't verify your payment!");
			}
		}
		let order;

		try {
			order = await prisma.orders.update({
				where: {
					id: Number(id),
				},
				data: {
					razorpayId: razorpayOrderId,
					razorpayPaymentId,
					paymentStatus: true,
					orderStatus: 'pending',
				},
				include: {
					service: {
						select: { title: true },
					},
				},
			});
		} catch (e) {
			console.log(e);
		}
		let base =
			(order.value * 100 * 100) / (118 * (100 - order.discount)).toFixed(2);
		await orderConfirmedEmail(
			order.service.title,
			order.orderDescription,
			base,
			0.18 * (base - (order.discount / 100) * base).toFixed(2),
			((order.discount / 100) * base).toFixed(2),
			order.value.toFixed(2),
			order.id,
			req.user.username,
			req.user.email
		);
		res.status(200).send('Success');
	} catch (error) {
		console.log(error);
		res.status(500).send(error);
	}
};

export { paymentReminder, sendPaymentLink, paymentVerification, retryPayment };
