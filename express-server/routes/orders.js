import express from 'express';
import fileUpload from 'express-fileupload';

import { authenticateUser } from '../controller/authenticate.js';
import {
	getOrders,
	createNewOrder,
	getOrderCount,
	getOrdersByMonth,
	getEditableOrders,
	refundOrder,
	updateOrder,
	getSingleOrderSummary,
	deleteOrder,
	sendOrderUpdateEmail,
	setOrderFailed,
} from '../controller/orders.js';

const route = express.Router();
route.use(authenticateUser);
route.get('/getorders/:idType?/:id?', getOrders);
route.get('/order-summary/:id', getSingleOrderSummary);
route.get('/editable-orders', getEditableOrders);
route.get('/orderCount/:orderType', getOrderCount);
route.get('/downloads/:month', getOrdersByMonth);
route.post('/newOrder', createNewOrder);
route.put('/refund/:orderId', refundOrder);
route.put('/updateOrder/:id', updateOrder);
route.put('/set-order-failed', setOrderFailed);
route.delete('/delete-order/:id', deleteOrder);
route.post('/order-update', fileUpload(), sendOrderUpdateEmail);

export default route;
