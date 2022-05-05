import { useEffect, useState } from 'react';
import { ServiceCardLayout } from '../../pages/Services';
import { Button } from '@mui/material';
import axios from '../../api/axios';
import Cookies from 'js-cookie';
import { Link } from 'react-router-dom';
import PlusOneIcon from '@mui/icons-material/PlusOne';
const ServiceList = () => {
	const [services, setServices] = useState([]);
	useEffect(() => {
		const controller = new AbortController();
		axios
			.get('/services/get-services/', { signal: controller.signal })
			.then(res => {
				setServices(prev => {
					return [...res.data];
				});
			});
		return () => {
			controller.abort();
		};
	}, []);
	return (
		<>
			<ServiceCardLayout
				services={services}
				type={Cookies.get('role') === '33' ? 'edit-service' : 'blog'}
			/>
			<Button
				component={Link}
				to='/dashboard/add-service'
				size='small'
				variant='contained'
				color='info'
				startIcon={<PlusOneIcon />}>
				Add New Service
			</Button>
		</>
	);
};

export default ServiceList;
