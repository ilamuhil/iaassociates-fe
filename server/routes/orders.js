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
} from '../controller/orders.js';
const route = express.Router();
route.use(authenticateUser);
route.get('/getorders/:idType?/:id?', getOrders);
route.get('/editable-orders', getEditableOrders);
route.get('/orderCount/:orderType', getOrderCount);
route.get('/downloads/:month', getOrdersByMonth);
route.post('/newOrder', createNewOrder);


route.put('/refund/:orderId', refundOrder);
route.put('/updateOrder/:id', updateOrder);


export default route;
