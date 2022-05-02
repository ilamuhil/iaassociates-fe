import express from "express";
import { authenticateUser } from "../controller/authenticate.js";
import { paymentReminder,sendPaymentLink ,paymentVerification} from "../controller/payments.js";
const route = express.Router();
route.use(authenticateUser);
route.post('/send-payment-reminder', paymentReminder);
route.post('/sendPaymentLink', sendPaymentLink);
route.post('/payments/verification/:id', paymentVerification);
export default route;