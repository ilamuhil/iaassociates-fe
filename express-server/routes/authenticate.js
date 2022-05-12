import express from 'express';
const route = express.Router();
import cors from 'cors';
import errorhandler from './error.js';
import { registerNewUser } from './../controller/user.js';
import {
	verifyLink,
	logInHandler,
	logOutHandler,
	getNewTokenHandler,
	authenticateUser,
} from './../controller/authenticate.js';
route.post('/login', logInHandler);
route.post('/register', registerNewUser);
route.get(
	'/logout',
	cors({
		origin: 'http://localhost:3000',
		credentials: true,
	}),
	authenticateUser,
	logOutHandler
);
route.post('/verifyLink', verifyLink);
route.post('/refresh', getNewTokenHandler);
route.use(errorhandler);

export default route;
