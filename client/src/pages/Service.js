import { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import axios from './../api/axios';
export default function Service() {
	const [dat, setData] = useState('');
	useEffect(() => {
		axios
			.get('/services/id/32')
			.then(response => {
				setData(response.data);
				console.log(response.data);
			})
			.catch(e => {
				console.log(e);
			});
	}, []);

	return (
		<Layout>
			<div className='container'>
				<h1 className='text-center' style={{ marginBlock: '100px' }}>
					{dat?.title}
				</h1>
				{dat ? (
					<div
						dangerouslySetInnerHTML={{ __html: dat.description }}
						className='mb-4'></div>
				) : (
					<div className='text-center' style={{ marginBlock: '30vh' }}>
						Loading content...
					</div>
				)}
			</div>
		</Layout>
	);
}
