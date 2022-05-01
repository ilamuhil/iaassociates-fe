import { getAllOrders,getfilteredOrders } from '../controller/orders.js';

// describe('get all orders', () => {
// 	test('orders query admin', () => {
// 		expect(getAllOrders('admin')).resolves.toBeDefined();
// 	});

// 	test('orders query cutomer', () => {
// 		expect(
// 			getAllOrders('customer', 'id', '051d5921-2ae6-4d69-abe2-48a408e93270')
// 		).resolves.toBeDefined();
// 	});
// 	test('no customer id sent by customer', () => {
// 		return expect(getAllOrders('customer')).rejects.toThrow(
// 			'Unauthorized Request'
// 		);
// 	});

// 	test('incorrect customer id', () => {
// 		return expect(
// 			getAllOrders('customer', 'idsd', '051921-2a6-4d69-abe2-48a408e93270')
// 		).rejects.toThrow('Could not get orders data');
// 	});

// 	test('orders query user', () => {
// 		expect(getAllOrders('user')).rejects.toThrow('No orders found');
// 	});
// });

describe('filtered orders', () => {
	test('orders query admin', async () => {
		let data = await getfilteredOrders('admin', { paymentStatus: false });
		console.log(data);
		expect(data[0].paymentStatus).toBe("false");
		// expect(getfilteredOrders('admin',{paymentStatus:false})).resolves.toBeDefined();
	});
	

	// test('orders query cutomer', () => {
	// 	expect(
	// 		getfilteredOrders('customer',{paymentStatus:true}, 'id', '051d5921-2ae6-4d69-abe2-48a408e93270')
	// 	).resolves.toBeDefined();
	// });
	// test('no customer id sent by customer', () => {
	// 	return expect(getAllOrders('customer')).rejects.toThrow(
	// 		'Unauthorized Request'
	// 	);
	// });

	// test('incorrect customer id', () => {
	// 	return expect(
	// 		getAllOrders('customer', 'idsd', '051921-2a6-4d69-abe2-48a408e93270')
	// 	).rejects.toThrow('Could not get orders data');
	// });

	// test('orders query user', () => {
	// 	expect(getAllOrders('user')).rejects.toThrow('No orders found');
	// });
});
