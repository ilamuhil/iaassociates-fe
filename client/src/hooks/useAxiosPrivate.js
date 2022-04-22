import  { axiosPrivate } from '../api/axios';
import { useEffect } from 'react';
import { useAuth } from './useAuth';
import { useRefreshToken } from './useRefreshToken';

const useAxiosPrivate = () => {
	const refresh = useRefreshToken();
	const { auth } = useAuth();
	useEffect(() => {
		const reqIntercept = axiosPrivate.interceptors.request.use(
			config => {
				if (!config.headers.Authorization) {
					config.headers.Authorization = `Bearer ${auth?.accessToken}`;
				}
				return config;
			},
			err => {
				return Promise.reject(err);
			}
		);
		const resIntercept = axiosPrivate.interceptors.response.use(
			response => response,
			async err => {
				const originalRequest = err?.config;
				if (err?.response?.status === 403 && !originalRequest.sent) {
					originalRequest.sent = true;
					const newAccessToken = await refresh();
					originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
					return axiosPrivate(originalRequest);
				}
				return Promise.reject(err);
			}
		);
		//cleanup the interceptors from piling up!
		return () => {
			axiosPrivate.interceptors.request.eject(reqIntercept);
			axiosPrivate.interceptors.response.eject(resIntercept);
		};
	}, [auth, refresh]);

	return axiosPrivate;
};

export default useAxiosPrivate;
