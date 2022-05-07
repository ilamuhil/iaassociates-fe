import { useContext, useEffect, useState } from 'react';
import { ServiceCardLayout } from '../../pages/Services';
import { Button } from '@mui/material';
import axios from '../../api/axios';
import { Link } from 'react-router-dom';
import PlusOneIcon from '@mui/icons-material/PlusOne';
import AuthContext from '../../context/AuthProvider';
const ServiceList = () => {
	const ctx = useContext(AuthContext);
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
				type={ctx.userRole === 33 ? 'edit-service' : 'blog'}
			/>
			{ctx.userRole === 33 && (
				<Button
					component={Link}
					to='/dashboard/add-service'
					size='small'
					variant='contained'
					color='info'
					startIcon={<PlusOneIcon />}>
					Add New Service
				</Button>
			)}
		</>
	);
};

export default ServiceList;
