import express from 'express';
import {
	findFilteredUser,
	updateAvatar,
	deleteUser,
	updateMarketing,
	
} from '../controller/user.js';
import { authenticateUser } from './../controller/authenticate.js';
const route = express.Router();
route.get('/:filterkey?/:filterValue?', findFilteredUser);
route.put('/avatar/:id?', updateAvatar);
route.use(authenticateUser);
route.delete('/:idType?/:id?', deleteUser);
route.post('/marketing/:id?', updateMarketing);

export default route;
