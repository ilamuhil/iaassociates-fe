import express from 'express';
const route = express.Router();
import {
	findFilteredUser,
	updateAvatar,
	deleteUser,
	updateMarketing,
} from '../controller/user.js';
import { authenticateUser } from './../controller/authenticate.js';
route.get('/:filterkey?/:filterValue?', findFilteredUser);
route.put('/avatar', updateAvatar);
route.delete('/', deleteUser);
route.post('/marketing/:id?', authenticateUser, updateMarketing);
export default route;
