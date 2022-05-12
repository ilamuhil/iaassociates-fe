import pkg from '@prisma/client';
const { PrismaClient } = pkg;
const prisma = new PrismaClient();

//if filterkey(id or title) and filtervalue(value of the id or title) are provided then the service is returned based on the filterkey and filtervalue
//if the url param is not provideed then all services are returned (admin permissions are not necessary)
//if queryparam 'edit' = true  then all the details are sent including description
const getService = async (req, res, next) => {
	let { filterkey, filtervalue } = req.params;
	filtervalue = filterkey === 'id' ? Number(filtervalue) : filtervalue;
	if (filterkey && filtervalue) {
		let payload = {
			id: true,
			title: true,
			highlights: true,
			SAC: true,
			description: req.query.description ? true : false,
		};
		try {
			let data = await prisma.services.findUnique({
				where: {
					[filterkey]: filtervalue,
				},
				select: payload,
			});
			res.status(200).send(data);
		} catch (e) {
			console.log(e);
			let err = new Error('Could not get Data');
			err.status = 500;
			next(err);
		}
	} else {
		try {
			let data = await prisma.services.findMany({
				select: {
					highlights: true,
					title: true,
					id: true,
				},
			});
			res.status(200).send(data);
		} catch (e) {
			let err = new Error('Could not get Service data!');
			err.status = 500;
			next(err);
		}
	}
};

//updating service requires admin permissions
const updateService = async (req, res, next) => {
	if (req.user.role !== 'admin') {
		res.status(403).send('Unauthorized request');
	}
	let { id } = req.params;
	let { title, highlights, description, sac } = req.body;
	console.log(
		'🚀 ~ file: services.js ~ line 57 ~ updateService ~ req.body',
		req.body
	);
	try {
		await prisma.services.update({
			where: {
				id: Number(id),
			},
			data: {
				title,
				SAC: sac,
				highlights: JSON.stringify(highlights),
				description,
			},
		});
		res.status(200).send('Updated service successfully');
	} catch (e) {
		console.error(e);
		let err = new Error('Error occurred while updating service');
		err.status = 500;
		next(err);
	}
};
//delete service by id
const deleteService = async (req, res, next) => {
	let { id } = req.params;
	try {
		await prisma.services.delete({
			where: {
				id: Number(id),
			},
		});
		res.status(200).send('Service deleted successfully');
	} catch (e) {
		let err = new Error(
			'Error occurred while deleting service.Try again later'
		);
		err.status = 500;
		next(err);
	}
};

const addNewService = async (req, res, next) => {
	let { title, highlights, description, SAC } = req.body;
	highlights = JSON.stringify(highlights);
	console.log(req.body);
	if (req.user.role !== 'admin') {
		res.status(403).send('Unauthorized Request');
	} else {
		try {
			await prisma.services.create({
				data: {
					title,
					description,
					highlights,
					SAC,
				},
			});
			res.status(200).send('successfully added service to database');
		} catch (e) {
			console.log(e);
			let err = new Error('Could not add service to database');
			err.status = 500;
			next(err);
		}
	}
};

const skipAuth = (req, res, next) => {
	req.skipAuthentication = true;
	next();
};
export { getService, addNewService, updateService, deleteService, skipAuth };
