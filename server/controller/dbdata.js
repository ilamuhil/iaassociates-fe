export const getdbdata = async (req, res, next) => {
	let data;
	if (req.user.role !== 'admin') {
		if (req.user.role === 'user') {
			orders = false;
		} else if (role === 'customer') {
			orders = true;
		}
		try {
			data = await prisma.users.findMany({
				select: {
					addresses: true,
					orders,
				},
				where: {
					id: req.user.id,
				},
			});
		} catch (e) {
			let err = new Error('Could not retrieve data');
			err.status = 500;
			next(err);
		}
	} else {
		//assume that data is for admin panel
		data = await prisma.users.findMany({
			select: {
				addresses: true,
				orders: true,
			},
		});
	}
	return { ...data, user: req.user };
};
