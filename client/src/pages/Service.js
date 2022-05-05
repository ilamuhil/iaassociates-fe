import { useState, useEffect } from 'react';
import { Layout } from '../components/UtilitiesAndWrappers/Layout';
import { useParams } from 'react-router-dom';
import { Container, Stack } from '@mui/material';
import axios from './../api/axios';
export default function Service() {
	const [dat, setData] = useState('');
	const { id } = useParams();
	useEffect(() => {
		const controller = new AbortController();
		axios
			.get(`/services/get-services/id/${id}`, {
				signal: controller.signal,
				params: { description: true },
			})
			.then(response => {
				setData(response.data);
			})
			.catch(e => {
				console.log(e);
			});
	}, [id]);

	return (
		<Layout>
			<Container>
				<Stack direction='column' justifyContent='center' spacing={2} mx='auto'>
					<div className='container ml-4'>
						<h1
							className='text-start'
							style={{ marginTop: '100px', marginBottom: '50px' }}>
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
				</Stack>
			</Container>
		</Layout>
	);
}
