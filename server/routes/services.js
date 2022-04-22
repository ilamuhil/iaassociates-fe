import express from 'express';
import {
	getService,
	addNewService,
	updateService,
	deleteService,
} from '../controller/services.js';
import { authenticateUser } from '../controller/authenticate.js';
const route = express.Router();
route.get('/:filterkey?/:filtervalue?', authenticateUser, getService);
route.post('/', authenticateUser, addNewService);
route.put('/:id', authenticateUser, updateService);
route.delete('/:id', authenticateUser, deleteService);
export default route;
