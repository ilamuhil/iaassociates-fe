import pkg from '@prisma/client';
import { sendPaymentReminder } from './sendMail.js';
const { PrismaClient } = pkg;
const prisma = new PrismaClient();

const paymentReminder = async (req, res, next) => {

	let data = await prisma.orders.findUnique({
		where: { id: req.body.orderId },
		select: {
			value: true,
			user: {
				select: {
					username:true,
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
			console.log('failed');
			res.status(400).json("Oops we couldn't verify your payment!");
		}

		await prisma.orders.update({
			where: {
				id: parseInt(id),
			},
			data: {
				razorpayId: razorpayOrderId,
				razorpayPaymentId,
				paymentStatus: true,
				orderStatus: 'pending',
			},
		});
		res.status(200).send('Success');
	} catch (error) {
		res.status(500).send(error);
	}
};

export { paymentReminder, sendPaymentLink, paymentVerification };
