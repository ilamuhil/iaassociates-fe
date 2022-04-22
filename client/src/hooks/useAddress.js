import { useEffect, useState } from 'react';
import axios from './../api/axios';

function useAddress(username = '', id = '') {
	const [fName, setFname] = useState('');
	const [lName, setLname] = useState('');
	const [adl1, setAdl1] = useState('');
	const [adl2, setAdl2] = useState('');
	const [city, setCity] = useState('');
	const [zipcode, setZipCode] = useState(0);
	const [state, setState] = useState('');
	const [phNo, setPhNo] = useState(0);
	const [invoiceType, setInvoiceType] = useState('');

	useEffect(() => {
		if (!username && !id) {
			return;
		}
		let controller = new AbortController();
		const urlPath = username
			? `/addresses/username/${username}`
			: `/addresses/id/${id}`;
		axios
			.get(urlPath, {
				headers: { Accept: 'application/json' },
				signal: controller.signal,
			})
			.then(res => {
				let { data } = res;
				setInvoiceType(data.invoiceType);
				setFname(data.first_name);
				setLname(data.last_name);
				setState(data.state);
				setAdl1(data.adl2);
				setAdl2(data.adl2);
				setZipCode(data.zipcode);
				setPhNo(data.phoneNo);
				setCity(data.city);
			})
			.catch(e => {
				console.error(e);
			});
		return () => {
			controller.abort();
		};
	}, [id,username]);
		return {
			fName,
			lName,
			adl1,
			adl2,
			zipcode,
			city,
			state,
			phNo,
			invoiceType,
		};
	
}

export default useAddress;
