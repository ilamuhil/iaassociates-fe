import { sendResetPasswordEmail } from './sendMail.js';
import { generateToken } from './../functions/util.js';
import pkg from 'validator';
const { isEmail } = pkg;
import { findUser } from './user.js';
import dotenv from 'dotenv';
dotenv.config();

export const resetPasswordRequestHandler = async (req, res, next) => {
	try {
		let { email, username } = req.body;
		//validate email
		if (!isEmail(email)) {
			let err = new Error('Invalid Email Address');
			err.status = 400;
			next(err);
		}
		//check email exists in database
		try {
			let userExists = await findUser({ email });
		} catch (e) {
			let err = new Error('email not found in database');
			err.status = 400;
			throw err;
		}
		//generate reset password token and send email to requested address
		let token = generateToken(
			{ email },
			process.env.RESET_PASSWORD_SECRET,
			10 * 60
		);
		sendResetPasswordEmail(username, email, token);
		res.status(200).send('Password reset email has been sent successfully');
	} catch (e) {
		console.log(e);
		next(e);
	}
};
