import pkg from '@prisma/client';
import { faker } from '@faker-js/faker';
import { format } from 'date-fns';
const { PrismaClient } = pkg;
const prisma = new PrismaClient();
const roles = ['admin', 'user', 'customer'];
const orderStatuses = [
	'created',
	'pending',
	'onhold',
	'completed',
	'failed',
	'refunded',
];
const reviewcontent = [
	'Best service, love the quality and overall experience. Awesome Giving 5 out of 5',
	'Was a little scared about purchasing this but its definitely genuine and really got delivered under 30mins even when i purchased at 1am past midnight 😅',
	"Don't purchased this, I got worst experience with seller and product.",
	'Pathetic service quality. Poor communication and response',
];
const reviewTitle = [
	'Great service',
	'Will recommend to colleagues',
	'Subpar service',
	'Very poor quality communication',
];
const rating = [5, 4, 2, 1];
const conditionalorderdata = () => {
	const orderStatus =
		orderStatuses[Math.floor(Math.random() * orderStatuses.length)];
	let paymentStatus;
	let invoiceDate;
	if (
		orderStatus === 'failed' ||
		orderStatus === 'refunded' ||
		orderStatus === 'created'
	) {
		paymentStatus = false;
	} else {
		paymentStatus = Math.random() >= 0.5 ? true : false;
	}
	let dates = [
		format(new Date(2022, 1, 23), 'dd MMMM yyyy'),
		format(new Date(2023, 5, 16), 'dd MMMM yyyy'),
	];
	invoiceDate =
		orderStatus === 'failed' ? 'NA' : dates[Math.floor(Math.random * 2) || 0];
	return { orderStatus, paymentStatus, invoiceDate };
};
const servicedata = [...Array(40).keys()].map(() => {
	return {
		title: faker.commerce.product(),
		description: faker.commerce.productDescription(),
		highlights: JSON.stringify([
			faker.commerce.productMaterial(),
			faker.commerce.productAdjective(),
			faker.commerce.productAdjective(),
			faker.commerce.productAdjective(),
		]),
		SAC: '0633910',
	};
});
const filteredservice = servicedata.filter((element, index, arr) => {
	for (let i = index + 1; i < arr.length; i++) {
		if (element.title === arr[i]?.title) return false;
	}
	return true;
});
const invoice = () => {
	const invoiceType = Math.random() >= 0.5 ? 'company' : 'personal';
	let fName, lName;
	let gst = [
		'18AABCU9603R1ZM',
		'22AABCU9603R1ZX',
		'06AABCU9603R1ZR',
		'32AABCU9603R1ZW',
		'08AABCU9603R1ZN',
	];

	if (invoiceType === 'company') {
		fName = faker.company.companyName();
		lName = gst[Math.floor(Math.random() * gst.length)];
	} else {
		fName = faker.name.firstName();
		lName = faker.name.lastName();
	}
	return { fName, lName, invoiceType };
};
const usersdata = [...Array(100).keys()].map(() => {
	return {
		id: faker.datatype.uuid(),
		username: faker.internet.userName(),
		email: faker.internet.email(),
		password: 'password',
		role: roles[Math.floor(Math.random() * roles.length)],
		active: Math.random() >= 0.5 ? true : false,
	};
});

const filteredusersdata = usersdata.filter((element, index, arr) => {
	for (let i = index + 1; i < arr.length; i++) {
		if (
			element.username === arr[i]?.username ||
			element.email === arr[i]?.email
		)
			return false;
	}
	return true;
});
const addresses = filteredusersdata.map(e => {
	return {
		userId: e.id,
		adl1: faker.address.streetName(),
		adl2: faker.address.streetAddress(),
		zipcode: parseInt(faker.address.zipCode()),
		city: faker.address.city(),
		state: faker.address.state(),
		phoneNo: faker.phone.phoneNumber(),
		...invoice(),
	};
});
let ordersdata = [];

filteredusersdata.forEach(e => {
	for (let i = 0; i < 5; i++) {
		if (e.role !== 'admin' && e.role !== 'user') {
			const serviceId = parseInt(
				Math.floor(Math.random() * filteredservice.length) + 1
			);
			ordersdata.push({
				userId: e.id,

				value: parseFloat(faker.finance.amount(1000, 25000)),
				discount: Math.floor(Math.random() * 50),
				serviceId,
				razorpayId: '',
				orderDescription: faker.commerce.productDescription(),
				invoiceNumber: 'IA00' + Math.floor(Math.random() * 1000),
				...conditionalorderdata(),
			});
		}
	}
});
let marketingpreference = [];
filteredusersdata.forEach(e => {
	marketingpreference.push({
		userId: e.id,
		ServiceOffers: Math.random() >= 0.5 ? true : false,
		complianceInfo: Math.random() >= 0.5 ? true : false,
	});
});
let reviews = [];
ordersdata.forEach((e, index) => {
	let review = Math.floor(Math.random() * 4);
	reviews.push({
		orderId: index + 1,
		serviceId: e.serviceId,
		userId:e.userId,
		title: reviewTitle[review],
		content: reviewcontent[review],
		starRating: rating[review],
		reviewstatus: Math.random() >= 0.5 ? 'pending' : 'approved',
	});
});
(async () => {
	await prisma.services.createMany({
		data: filteredservice,
	});
	await prisma.users.createMany({
		data: filteredusersdata,
	});
	await prisma.address.createMany({
		data: addresses,
	});
	await prisma.orders.createMany({
		data: ordersdata,
	});
	await prisma.reviews.createMany({
		data: reviews,
	});
	await prisma.marketingPreference.createMany({
		data: marketingpreference,
	});
})();
