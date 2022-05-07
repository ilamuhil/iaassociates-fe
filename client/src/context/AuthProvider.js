import { createContext, useState } from 'react';
import { axiosPrivate } from './../api/axios';
import cookie from 'js-cookie';
import { toast } from 'react-toastify';

const AuthContext = createContext({
	isLoggedIn: Boolean(cookie.get('isLoggedIn')),
	login: accesstoken => {},
	logout: () => {},
	userRole: cookie.get('isLoggedIn') ? cookie.get('isLoggedIn') : 0,
	useAxiosPrivate: () => {},
});

export const AuthProvider = props => {
	const [userIsLoggedIn, setUserIsLoggedIn] = useState(
		Boolean(cookie.get('isLoggedIn'))
	);
	const [role, setRole] = useState(parseInt(cookie.get('role')) || 0);
	const loginHandler = (accessToken, refreshToken, roleCode) => {
		setUserIsLoggedIn(true);
		setRole(parseInt(cookie.get('role')));
	};
	const logOutHandler = () => {
		const id = toast.loading('logging out user');
		axiosPrivate
			.get('/authenticate/logout')
			.then(res => {
				toast.update(id, {
					render: res.data,
					type: 'success',
					isLoading: false,
				});
				window.location.replace('/');
				setUserIsLoggedIn(false);
			})
			.catch(e => {
				console.log(e);
				toast.update(id, {
					render: e.response.data,
					type: 'error',
					isLoading: false,
				});
				window.location.replace('/');
				setUserIsLoggedIn(false);
			});
	};
	const axiosPrivateHandler = () => {
		axiosPrivate.interceptors.response.use(
			response => response,
			async err => {
				const originalRequest = err?.config;
				if (err?.response?.status === 403 && !originalRequest.sent) {
					originalRequest.sent = true;
					await refreshTokenHandler();
					return axiosPrivate(originalRequest);
				}
				return Promise.reject(err);
			}
		);
		return axiosPrivate;
	};

	const refreshTokenHandler = async () => {
		try {
			await axiosPrivate.get('authenticate/refresh');
		} catch (err) {
			console.error(err);
			logOutHandler();
		}
	};

	let contextValue = {
		isLoggedIn: userIsLoggedIn,
		login: loginHandler,
		logout: logOutHandler,
		useAxiosPrivate: axiosPrivateHandler,
		userRole: role,
	};
	return (
		<AuthContext.Provider value={contextValue}>
			{props.children}
		</AuthContext.Provider>
	);
};

export default AuthContext;
