import express from 'express';
import { authenticateUser } from '../controller/authenticate.js';
import { getAddress, updateAddress } from '../controller/address.js';
const route = express.Router();

route.get('/:idType?/:id?', getAddress);
route.post('/billingDetails/:idType?/:id?', updateAddress);
export default route;
