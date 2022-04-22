import express from 'express';
import { authenticateUser } from '../controller/authenticate.js';
const route = express.Router();
import { getAddress, updateAddress } from '../controller/address.js';

route.get('/:idType?/:id?', getAddress);
route.post('/billingDetails/:idType?/:id?', authenticateUser, updateAddress);
export default route;
