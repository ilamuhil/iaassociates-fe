import axios from './../api/axios';

const useRefreshToken = () => {	
	const refresh = async () => {
		try {
			await axios.post('/refresh');
		} catch (e) {
			window.href.replace("/login");
		}
	};
	return refresh;
};

export default useRefreshToken;
