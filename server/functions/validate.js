const emailReg = /^\w+(?:[\.\-\+]?\w+)*@\w+(?:[\.-]?\w+)*(?:\.\w{2,10})+$/g;
const phoneNumber = /^\+?\(?\+?(?:91|0)?\)?[ -]?(\d{5})[ -]?(\d{5})$/g;

const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[\w\W]{8,}$/g;
//atleast one number and one capital letter
const usernameReg = /^(\w+(?:[\.\-\s]?\w+)*){5,}/gim;
usernameReg.exec('Username-'); //?

const phonevalidate = number => {
	let res = phoneNumber.exec(number);
	return res ? parseInt(res[1] + res[2]) : false;
};
const emailvalidate = email => {
	let res = emailReg.exec(email);
	return res ? email : false;
};
const usernamevalidate = username => {
	let res = usernameReg.exec(username);
	return res ? username : false;
};
const passwordvalidate = password => {
	let res = passwordRegex.exec(password);
	return res ? password : false;
};

export { phonevalidate, emailvalidate, usernamevalidate, passwordvalidate };
