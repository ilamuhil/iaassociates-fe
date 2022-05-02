import dotenv from 'dotenv';
import helmet from 'helmet';
dotenv.config();
import cors from 'cors';
import express from 'express';
import updates from './routes/updates.js';
import userAuth from './routes/authenticate.js';
import users from './routes/users.js';
import orders from './routes/orders.js';
import contact from './routes/contact.js';
import dbdata from './routes/dbdata.js';
import errorhandler from './routes/error.js';
import services from './routes/services.js';
import cookieParser from 'cookie-parser';
import { authenticateUser } from './controller/authenticate.js';
import addresses from './routes/addresses.js';
import payments from './routes/payments.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

app.use(helmet());
app.use(express.json());
app.use(
	express.urlencoded({
		extended: false,
	})
);

app.use(cookieParser());
const port = process.env.PORT || 8000;
app.use(cors({ origin: process.env.WEBSITE_URL, credentials: true }));
app.use('/dbdata', dbdata);
app.use('/addresses', authenticateUser, addresses);
app.use('/updates', updates);
app.use('/user', authenticateUser, users);
app.use('/authenticate', userAuth);
app.use('/orders', authenticateUser, orders);
app.use('/contact', contact);
app.use('/payments', payments);
app.use('/services', services);

app.get('/test', async (req, res) => {
	res.sendFile('abc.txt', { root: path.join(__dirname) }, err => {
		if (err) {
			console.log(err);
		} else {
			console.log('abc.txt');
		}
	});
});

app.use(errorhandler);

app.listen(port, () => console.log('Server is running on port ' + port));
