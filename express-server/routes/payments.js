import express from 'express';
import { authenticateUser } from '../controller/authenticate.js';
import {
	paymentReminder,
	sendPaymentLink,
	paymentVerification,
	retryPayment,
	getPaymentRefundStatus,
} from '../controller/payments.js';
const route = express.Router();
route.use(authenticateUser);
route.get("/get-payment-refund-status/:id", getPaymentRefundStatus);
route.post('/send-payment-reminder', paymentReminder);
route.post('/send-payment-link', sendPaymentLink);
route.post('/verification/:id', paymentVerification);
route.post('/retry-payment', retryPayment);
export default route;
