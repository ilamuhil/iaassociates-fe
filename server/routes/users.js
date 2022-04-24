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
route.delete('/:idType?/:id?', authenticateUser, deleteUser);
route.post('/marketing/:id?', authenticateUser, updateMarketing);

export default route;
