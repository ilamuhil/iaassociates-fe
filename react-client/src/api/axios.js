const axios = require('axios');
const BASE_URL = 'http://localhost:8000/';

export default axios.create({
	baseURL: BASE_URL,
	withCredentials: true,
});

export const axiosext = axios;
export const axiosPrivate = axios.create({
	baseURL: BASE_URL,
	headers: { 'Content-Type': 'application/json' },
	withCredentials: true,
});
