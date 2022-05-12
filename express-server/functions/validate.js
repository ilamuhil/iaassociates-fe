const emailReg = /^\w+(?:[\.\-\+]?\w+)*@\w+(?:[\.-]?\w+)*(?:\.\w{2,10})+$/;
const phoneNumber = /^\+?\(?\+?(?:91|0)?\)?[ -]?(\d{5})[ -]?(\d{5})$/;

const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[\w\W]{8,}$/;
//atleast one number and one capital letter
const usernameReg = /^[_\.\-\s\w+]{5,}/;

const phonevalidate = number => {
	let res = phoneNumber.exec(number);
	return res ? parseInt(res[1] + res[2]) : false;
};
const emailvalidate = email => {
	let res = emailReg.exec(email);
	console.log(res);
	return res ? email : false;
};
const usernamevalidate = username => {
	let res = usernameReg.exec(username);
	console.log('🚀 ~ file: validate.js ~ line 21 ~ res', res);
	return res ? username : false;
};
const passwordvalidate = password => {
	let res = passwordRegex.exec(password);
	return res ? password : false;
};

export { phonevalidate, emailvalidate, usernamevalidate, passwordvalidate };
