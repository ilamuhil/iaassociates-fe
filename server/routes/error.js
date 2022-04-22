import pkg from "@prisma/client";
const { Prisma } = pkg;
const errorhandler = (error, req, res, next) => {
	if (error instanceof Prisma.PrismaClientKnownRequestError) {
		let err = new Error();
		if (error.code === 'P2025') {
			err.message = 'requested record was not found';
			err.status = 401;
		} else if (error.code === 'P2002') {
			err.message =
				'the entered details for one or more fields already exists in our database';
			err.status = 401;
		} else if (error.code === 'P1002') {
			err.message = 'database resource request timeout error';
			error.status = 503;
		} else if (error.code === 'P2001') {
			err.message = 'Requested record does not exist in our database';
			err.status = 401;
		} else {
			err.message = `Message:${error.message}, Prisma error Code:${error.code}`;
			err.status = 500;
		}
		res.status(err.status).send(err.message);
		return;
	}
	res.status(error?.status).send(error.message);
	
}
export default errorhandler;
