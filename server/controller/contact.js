import { contactEmail } from './sendMail.js';
export const contactFormHandler = async (
	{ body: { email, name, phoneNumber, serviceName, message } },
	res
) => {
	try {
		await contactEmail(name, email, phoneNumber, serviceName, message);
		res.status(200).send('Message has been sent successfully');
	} catch (e) {
		console.error(e);
		res.status(500).send("Couldn't submit your form. Try again later");
	}
};
