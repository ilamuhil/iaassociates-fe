import crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config();
import jwt from 'jsonwebtoken';
import pkg from '@prisma/client';
const { PrismaClient } = pkg;
let prisma = new PrismaClient();

//hash any given string
const hashPassword = password => {
	console.log(process.cwd());
	let hashedpwd = crypto
		.pbkdf2Sync(password, process.env.HASH_PASSWORD_SECRET, 1000, 64, 'sha512')
		.toString('hex');
	return hashedpwd;
};

/**
 * @param  {} payload
 * @param  {} secret
 * @param  {} time='300s'
 * returns a jwt access/refresh token based on the parameter values access
 * refresh token has an expiry of a month
 * access token has an expiry of 5 min
 * {@link hashPassword}
 */
const generateToken = (payload, secret, time = '300s') => {
	try {
		let token = jwt.sign(payload, secret, { expiresIn: time });
		return token;
	} catch (e) {
		console.log(e);
		let err = new Error('Could not create token');
		err.status = 500;
		throw err;
	}
};
const verifyToken = (token, secret) => {
	try {
		let payload = jwt.verify(token, secret);
		return payload;
	} catch (error) {
		let err = new Error('Could not verify Token');
		err.status = 500;
		throw err;
	}
};
function generatePassword() {
	var pass = '';
	var str =
		'ABCDEFGHIJKLMNOPQRSTUVWXYZ' + 'abcdefghijklmnopqrstuvwxyz0123456789@#$';

	for (i = 1; i <= 8; i++) {
		var char = Math.floor(Math.random() * str.length + 1);

		pass += str.charAt(char);
	}

	return pass;
}

export { verifyToken, generateToken, hashPassword, generatePassword, prisma };
