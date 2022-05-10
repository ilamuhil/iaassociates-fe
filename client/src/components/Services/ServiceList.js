import { useContext } from 'react';
import { ServiceCardLayout } from '../../pages/Services';
import { Button } from '@mui/material';

import { Link } from 'react-router-dom';
import PlusOneIcon from '@mui/icons-material/PlusOne';
import AuthContext from '../../context/AuthProvider';
import useServices from '../../hooks/useServices';
const ServiceList = () => {
	const ctx = useContext(AuthContext);
	const services = useServices();
	return (
		<>
			{services && (
				<ServiceCardLayout
					services={services}
					type={ctx.userRole === 33 ? 'edit-service' : 'blog'}
				/>
			)}
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
