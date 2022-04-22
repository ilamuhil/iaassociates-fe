import express from 'express';
const route = express.Router();
import errorhandler from './error.js';
import { resetPasswordRequestHandler } from './../controller/resetPassword.js';
import {
	updatePassword,
	updatePwd,
	authenticateUser,
} from './../controller/authenticate.js';

//receive updated password and update database
route.post('/password', updatePassword);
route.put('/updatePwd', authenticateUser, updatePwd);
//receive password reset request from client and send mail to reset password
route.post('/resetPasswordRequest', resetPasswordRequestHandler);
route.use(errorhandler);
export default route;
