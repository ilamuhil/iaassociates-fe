import express from 'express';
const route = express.Router();

import {
	getOrdersById,
	createNewOrder,
	getAllOrdersByUserRole,
	getOrderCount,
} from '../controller/orders.js';

route.get('/', getAllOrdersByUserRole);
route.get('/:id', getOrdersById);
route.post('/newOrder', createNewOrder);
route.get('/orderCount/:orderType', getOrderCount);
// razorpay_payment_id: 'pay_J7UtfvJpuQWmhG',
//   razorpay_order_id: 'order_J7UtW6zNHI31PL',
//   razorpay_signature: '49df9b4e8d5cb4e0cd4f6eb153d39e114e64ebe7aa3fd14524a2f13ac545586b'
route.post('/order-status/', (req, res) => {
	let { razorpay_signature, razorpay_order_id, razorpay_payment_id } = req.body;
	if (razorpay_signature) {
		validatePaymentVerification(
			{ order_id: razorpay_order_id, payment_id: razorpay_payment_id },
			razorpay_signature,
			'uG7iqGUiJvbgVMB4osmsqb4w'
		);
	}
	res.send('Great !!!');
});
export default route;
