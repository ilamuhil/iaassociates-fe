import { useEffect, useState } from 'react';
import axios from './../api/axios';
const useServices = () => {
	const [services, setServices] = useState('');
	useEffect(() => {
		const controller = new AbortController();
		axios
			.get('/services/get-services/', { signal: controller.signal })
			.then(res => {
				setServices(prev => {
					return [...prev, ...res.data];
				});
			})
			.catch(e => console.error(e));
		return () => {
			controller.abort();
		};
	}, []);

	return services;
};

export default useServices;
