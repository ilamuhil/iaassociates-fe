import axios from './../api/axios';
import useAuth from './useAuth';

const useRefreshToken = () => {
	const { auth, setAuth } = useAuth();
	console.log(JSON.stringify(auth));
	const refresh = async () => {
		const response = await axios.post('/refresh', auth);
		setAuth(prev => {
			console.log(
				JSON.stringify({ ...prev, accessToken: response.data.accessToken })
			);
			return { ...prev, accessToken: response.data.accessToken };
		});
		return response.data.accessToken;
	};

	return refresh;
};

export default useRefreshToken;
