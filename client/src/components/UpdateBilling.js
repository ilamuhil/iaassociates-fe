import axios from 'axios';
import { useCallback, useContext, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import AuthContext from '../context/AuthProvider';
import { toast } from 'react-toastify';
import { TextField, Checkbox, Button, FormControlLabel } from '@mui/material';
const UpdateBilling = ({ email, setEmail }) => {
	const ctx = useContext(AuthContext);
	const axiosPvt = ctx.useAxiosPrivate();
	const { id: urlpath } = useParams();
	const [companyInvoice, setCompanyInvoice] = useState(true);
	const [fname, setFname] = useState('');
	const [lname, setLname] = useState('');
	const [phoneNo, setPhoneNo] = useState('');
	const [adl1, setAdl1] = useState('');
	const [adl2, setAdl2] = useState('');
	const [city, setCity] = useState('');
	const [state, setState] = useState('');
	const [zipcode, setZipcode] = useState(0);
	useEffect(() => {
		axiosPvt
			.get(urlpath ? `/addresses/id/${urlpath}` : '/addresses')
			.then(({ data }) => {
				setAdl1(data.adl1);
				setAdl2(data.adl2);
				setZipcode(data.zipcode);
				setPhoneNo(data.phoneNo);
				setFname(data.fName);
				setLname(data.lName);
			});
	}, [axiosPvt, urlpath]);
	const updateBilling = useCallback(() => {
		const invoiceType = companyInvoice ? 'company' : 'personal';
		let payload = {
			adl1,
			adl2,
			zipcode,
			city,
			state,
			fname,
			lname,
			email,
			phoneNo,
			invoiceType,
		};
		console.log(city, state);

		const url = urlpath
			? `/addresses/billingDetails/id/${urlpath}`
			: '/addresses/billingDetails';
		const toastid = toast.loading('Saving address to database');
		axiosPvt
			.post(url, payload)
			.then(res => {
				toast.update(toastid, {
					render: res.data.message,
					type: 'success',
					isLoading: false,
					autoClose: 1000,
				});
			})
			.catch(err => {
				if (err?.response) {
					toast.update(toastid, {
						render: err.response.data,
						type: 'error',
						isLoading: false,
						autoClose: 2000,
					});
				} else {
					console.error(err.request);
					toast.update(toastid, {
						render: 'Server Unavailable.Try again later',
						type: 'error',
						isLoading: false,
						autoClose: 2000,
					});
				}
			});
	}, [
		adl1,
		email,
		adl2,
		zipcode,
		state,
		city,
		phoneNo,
		fname,
		lname,
		axiosPvt,
		companyInvoice,
		urlpath,
	]);
	const validateBilling = useCallback(async () => {
		const toastId = toast.loading('validating address...');
		if (!fname || !lname || !phoneNo || !zipcode) {
			toast.update(toastId, {
				render: 'Please fill in the empty fields',
				type: 'warning',
				isLoading: false,
				autoClose: 2000,
			});
		}
		try {
			let res = await axios.get(
				'https://api.postalpincode.in/pincode/' + zipcode
			);
			if (res?.data && res?.data[0].Status === 'Error') {
				toast.update(toastId, {
					render: 'You have entered an invalid pincode',
					type: 'error',
					isLoading: false,
					autoClose: 2000,
				});
				return;
			} else if (res?.data && res?.data[0].Status === 'Success') {
				toast.update(toastId, {
					render: 'Address validated ✔︎',
					type: 'success',
					isLoading: false,
					autoClose: 1000,
				});
				setState(res.data[0].PostOffice[0].State);
				setCity(res.data[0].PostOffice[0].District);
				updateBilling();
			}
		} catch (e) {
			toast.update(toastId, {
				render: 'An error occurred try again later',
				type: 'error',
				isLoading: false,
				autoClose: 2000,
			});
			return;
		}
	}, [updateBilling, zipcode, fname, lname, phoneNo]);
	return (
		<div className='col'>
			<div className='row mb-2'>
				<div className='col'>
					<div className='form-group'>
						<TextField
							value={fname}
							onChange={e => {
								setFname(e.target.value);
							}}
							fullWidth
							id='first name'
							label={!companyInvoice ? 'First Name' : 'Company/Firm Name'}
							variant='standard'
						/>
					</div>
				</div>
				<div className='col'>
					<div className='form-group'>
						<TextField
							value={lname}
							onChange={e => {
								setLname(e.target.value);
							}}
							fullWidth
							id='last name'
							label={!companyInvoice ? 'Last Name' : 'GSTIN'}
							variant='standard'
						/>
					</div>
				</div>
			</div>
			<div className='row mb-2'>
				<div className='col'>
					<div className='form-group'>
						<TextField
							value={email}
							onChange={e => {
								setEmail(e.target.value);
							}}
							fullWidth
							id='email'
							label='email'
							variant='standard'
						/>
					</div>
				</div>
				<div className='col'>
					<div className='form-group'>
						<TextField
							value={phoneNo}
							onChange={e => {
								setPhoneNo(e.target.value);
							}}
							fullWidth
							id='Phone Number'
							label='Phone Number'
							variant='standard'
						/>
					</div>
				</div>
			</div>
			<div className='row'>
				<div className='col-lg-6 mb-3'>
					<div className='form-group'>
						<TextField
							value={adl1}
							onChange={e => {
								setAdl1(e.target.value);
							}}
							fullWidth
							id='Flat Number &amp; Appartment Details'
							label='Flat Number &amp; Appartment Details'
							variant='standard'
						/>
					</div>
				</div>
				<div className='col-lg-6 mb-3'>
					<div className='form-group'>
						<TextField
							value={adl2}
							onChange={e => {
								setAdl2(e.target.value);
							}}
							fullWidth
							id='Street Address &amp; Locality'
							label='Street Address &amp; Locality'
							variant='standard'
							helperText='Do not provide State/City details'
						/>
					</div>
				</div>
			</div>
			<div className='row'>
				<div className='col-lg-6 mb-3'>
					<FormControlLabel
						control={
							<Checkbox
								checked={companyInvoice}
								size='small'
								onChange={e => {
									setCompanyInvoice(e.target.checked);
								}}
							/>
						}
						label='Company Invoice'
					/>
				</div>
				<div className='col-lg-6 mb-3'>
					<div className='form-group'>
						<TextField
							fullWidth
							id='zipcode'
							type='number'
							label='zipcode'
							variant='standard'
							value={zipcode}
							onChange={e => {
								setZipcode(parseInt(e.target.value));
							}}
						/>
					</div>
				</div>
			</div>
			<div className='row mb-4'>
				<div className='col-lg-6 mb-3'>
					<Button
						color='warning'
						variant='contained'
						size='small'
						onClick={validateBilling}>
						Update Billing Info
					</Button>
				</div>
				<div className='col-lg-6'></div>
			</div>
		</div>
	);
};

export default UpdateBilling;
