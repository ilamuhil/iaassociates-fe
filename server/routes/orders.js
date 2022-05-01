import express from 'express';
import { authenticateUser } from '../controller/authenticate.js';
import {
	getOrders,
	createNewOrder,
	getOrderCount,
	getOrdersByMonth,
	getEditableOrders,
	refundOrder,
	updateOrder,
	paymentVerification,
} from '../controller/orders.js';
const route = express.Router();

route.get('/getorders/:idType?/:id?', getOrders);
route.use(authenticateUser);
route.get('/editable-orders', getEditableOrders);
route.post('/newOrder', createNewOrder);
route.get('/orderCount/:orderType', getOrderCount);
route.get('/downloads/:month', getOrdersByMonth);
route.put('/refund/:orderId', refundOrder);
route.put('/updateOrder/:id', updateOrder);
// razorpay_payment_id: 'pay_J7UtfvJpuQWmhG',
//   razorpay_order_id: 'order_J7UtW6zNHI31PL',
//   razorpay_signature: '49df9b4e8d5cb4e0cd4f6eb153d39e114e64ebe7aa3fd14524a2f13ac545586b'

route.post('/payments/verification/:id', paymentVerification);
export default route;
