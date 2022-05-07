import { useState, useEffect } from 'react';
import { Layout } from '../components/UtilitiesAndWrappers/Layout';
import { useParams } from 'react-router-dom';
import { Container, Stack, Box, Fade, Skeleton } from '@mui/material';
import Breadcrumbs from './../components/UtilitiesAndWrappers/Breadcrumbs';
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
			<Breadcrumbs pageName={`${dat.title}`} />
			<Container>
				<Stack
					direction='column'
					justifyContent='center'
					spacing={2}
					mx='auto'
					pt={15}>
					{!dat ? (
						<Box sx={{ maxWidth: '750px', p: 4, mb: 5 }} mx='auto'>
							<Skeleton
								variant='rectangular'
								width={750}
								height={500}
								sx={{ mb: 4, borderRadius: 4 }}
							/>
						</Box>
					) : (
						<Fade in={true} timeout={2000}>
							<Box
								sx={{
									maxWidth: '750px',
									p: 4,
									mb: 5,
									boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px',
									borderRadius: 4,
									backgroundColor: '#bdd4e7',
									backgroundImage:
										'linear-gradient(315deg, #bdd4e7 0%, #8693ab 74%)',
								}}
								mx='auto'>
								<h1
									className='text-center'
									style={{ marginTop: '50px', marginBottom: '50px' }}>
									{dat.title}
								</h1>
								<div
									dangerouslySetInnerHTML={{ __html: dat.description }}
									className='mb-4'></div>
							</Box>
						</Fade>
					)}
				</Stack>
			</Container>
		</Layout>
	);
}
