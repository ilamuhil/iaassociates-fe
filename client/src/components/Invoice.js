import { useState, useEffect, useContext } from 'react';
import { Link, useParams } from 'react-router-dom';
import Chip from '@mui/material/Chip';
import Alert from '@mui/material/Alert';
import '../styles/css/invoice.css';
import usePricingCalculator from '../hooks/usePricingCalculator';
import AuthContext from '../context/AuthProvider';
import axios from './../api/axios';
function Invoice() {
	const { orderId } = useParams();
	const [orderValue, setOrderValue] = useState(0);
	const [paymentStatus, setPaymentStatus] = useState(0);
	const [address, setAddress] = useState({
		name: 'Waiting for data...',
		adl1: 'Waiting for data...',
		adl2: 'Waiting for data...',
		zipcode: 0,
		state: 'NA',
		city: 'NA',
		phoneNo: 0,
	});
	const [serviceTitle, setServiceTitle] = useState();
	const [sac, setSac] = useState('');
	const [orderDesc, setOrderDesc] = useState('');
	const [orderDiscount, setOrderDiscount] = useState(0);
	const [dataNotFound, setDataNotFound] = useState(false);
	const [taxType, setTaxType] = useState('IGST');
	const [invoiceDate, setInvoiceDate] = useState([]);
	const price = usePricingCalculator(orderValue, orderDiscount);
	const authctx = useContext(AuthContext);
	useEffect(() => {
		// let axiosPvt = authctx.useAxiosPrivate();
		const controller = new AbortController();
		axios
			.get(`orders/${orderId}`, {
				signal: controller.signal,
			})
			.then(response => {
				if (!response?.data?.error) {
					let { data } = response;
					let { title, SAC, id: serviceId } = data.service;
					let {
						orderDescription,
						value,
						address,
						paymentStatus,
						discount,
						createdAt,
					} = data;
					setOrderValue(value);
					setAddress(prevState => {
						return {
							...prevState,
							name: address.name,
							adl1: address.adl1,
							adl2: address.adl2,
							state: address.state,
							phoneNo: address.phoneNo,
							zipcode: address.zipcode,
							city: address.city,
						};
					});
					setInvoiceDate(prevState => [
						...prevState,
						createdAt.split('T')[0].split('-'),
					]);

					if (address.state === 'TN') {
						setTaxType('CGST + SGST');
					}
					if (paymentStatus) {
						setPaymentStatus('PAID');
					} else {
						setPaymentStatus('UNPAID');
					}

					setOrderDesc(orderDescription);
					setServiceTitle(title);
					setSac(SAC);
					setOrderDiscount(discount);
				} else {
					setDataNotFound(true);
				}
			})
			.catch(e => {
				setDataNotFound(true);
				console.log(e);
			});
		return () => {
			controller.abort();
		};
	}, [orderId, authctx]);

	return dataNotFound ? (
		<Alert severity='error'>
			Could not Retrieve Order Data from Server. Check again Later!
		</Alert>
	) : (
		<div className='container wrapper'>
			<div className='row'>
				<div className='col-xs-12'>
					<div className='grid invoice'>
						<div className='grid-body'>
							<div className='invoice-title'>
								<br />
								<div className='row'>
									<div className='col-xs-12'>
										<h2 style={{ color: '#1976d2' }}>
											ILAMURUGU & ASSOCIATES
											<br />
										</h2>
										<span className='small'>Invoice #1082</span>
									</div>
								</div>
							</div>
							<hr />
							<div className='row'>
								<div className='col-6'>
									<address>
										<strong className='d-block'>BILLED BY: </strong>
										<br />
										<b style={{ color: '#1976d2' }}>ILAMURUGU AND ASSOCIATES</b>
										<br />
										795 Folsom Ave, Suite 600
										<br />
										<b>City: </b>
										Chennai
										<br />
										<b>State: </b>
										Tamil Nadu
										<br />
										<b>Pincode: </b>600074
										<br />
										<b>Phone number:</b> (+91) 9786543210
										<br />
										<b>GSTIN:</b> 33AAQFC5091H1ZA
									</address>
									<br />
									<address>
										<strong>Payment Method:</strong>
										<br />
										Visa ending **** 1234
										<br />
										h.elaine@gmail.com
										<br />
									</address>
								</div>
								<div className='col-6'>
									<address>
										<strong className='d-block'>BILLING ADDRESS:</strong>
										<br />
										<b>Name: </b>
										{address.name}
										<br />
										<b>Phone number: </b>
										{address.phoneNo}
										<br />
										<b>Address: </b>

										{address.adl1}
										<br />
										{address.adl2}
										<br />
										<b>City: </b>
										{address.city}
										<br />
										<b>State: </b>
										{address.state}
										<br />
										<b>Pincode: </b>
										{address.zipcode}
										<br />
									</address>
									<br />
									<address>
										<strong>Invoice generated on:</strong>
										<br />
										{invoiceDate !== undefined
											? `${invoiceDate?.[0]?.[2]}/${invoiceDate?.[0]?.[1]}/${invoiceDate?.[0]?.[0]}`
											: 'data not retrieved yet'}
									</address>
								</div>
							</div>
							<div className='row'>
								<div className='col-md-12'>
									<h3 className='py-4' style={{ color: '#1976d2' }}>
										ORDER SUMMARY
									</h3>
									<table className='table table-striped table-bordered'>
										<thead>
											<tr className='line'>
												<td>
													<strong>S.No</strong>
												</td>
												<td>
													<strong>Service Description</strong>
												</td>
												<td className='text-end'>
													<strong>SAC</strong>
												</td>
												<td className='text-end'>
													<strong>DISCOUNT</strong>
												</td>
												<td className='text-end'>
													<strong>PRICE</strong>
												</td>
											</tr>
										</thead>
										<tbody>
											<tr>
												<td>1</td>
												<td>
													<strong>{serviceTitle}</strong>
													<br />
													{orderDesc}
												</td>
												<td className='text-end'>{sac}</td>

												<td className='text-end'>
													{orderDiscount !== 0 ? (
														<>
															<b>{orderDiscount}%</b>
															<br />
														</>
													) : (
														'NA'
													)}
												</td>
												<td className='text-end'>
													{price.basePrice}₹<br />
													<small className='text-success'>
														-{price.discountValue}₹
													</small>
												</td>
											</tr>

											<tr>
												<td colSpan='3'></td>
												<td className='text-end'>
													<strong>
														{taxType}
														<strong> (18%) </strong>
													</strong>
												</td>
												<td className='text-end'>
													<small>+{price.taxValue}₹ </small>
												</td>
											</tr>
											<tr>
												<td colSpan='3'></td>
												<td className='text-end'>
													<strong>Total</strong>
												</td>
												<td className='text-end'>
													<strong>{orderValue}₹</strong>
												</td>
											</tr>
										</tbody>
									</table>
								</div>
							</div>
							<div className='row'>
								<div className='col-md-12 text-start identity'>
									<p>
										This service is bound by{' '}
										<Link to='http://vaoh.uz/doezemod'>
											Terms and Conditions
										</Link>{' '}
										mentioned on the website{' '}
										<Link to='/'>https://www.ilamsca.com</Link>
										<br />
									</p>
									<small className='ml-0'>
										<b>This invoice is</b>
									</small>
									<Chip
										label={paymentStatus}
										color={paymentStatus === 'PAID' ? 'success' : 'error'}
										size='small'
										sx={{ ml: 2 }}
									/>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Invoice;
