import { useState, useEffect, useContext } from 'react';
import { Link, useParams } from 'react-router-dom';
import Chip from '@mui/material/Chip';
import PaidIcon from '@mui/icons-material/Paid';
import MoneyOffCsredIcon from '@mui/icons-material/MoneyOffCsred';
import Alert from '@mui/material/Alert';
import '../../styles/css/invoice.css';
import usePricingCalculator from '../../hooks/usePricingCalculator';
import AuthContext from '../../context/AuthProvider';
import { Fade, Skeleton } from '@mui/material';
import axios from '../../api/axios';
import { format } from 'date-fns';
function Invoice() {
	const { orderId } = useParams();
	const [orderValue, setOrderValue] = useState(0);
	const [paymentStatus, setPaymentStatus] = useState(0);
	const [address, setAddress] = useState({
		fName: '',
		lName: '',
		adl1: '',
		adl2: '',
		zipcode: 0,
		state: '',
		city: '',
		phoneNo: 0,
	});
	const [serviceTitle, setServiceTitle] = useState();
	const [sac, setSac] = useState('');
	const [orderDesc, setOrderDesc] = useState('');
	const [orderDiscount, setOrderDiscount] = useState(0);
	const [dataNotFound, setDataNotFound] = useState(false);
	const [taxType, setTaxType] = useState('IGST');
	const [invoiceDate, setInvoiceDate] = useState('');
	const [invoiceNumber, setInvoiceNumber] = useState('');
	const [email, setEmail] = useState('');
	const price = usePricingCalculator(orderValue, orderDiscount);
	const authctx = useContext(AuthContext);
	useEffect(() => {
		// let axiosPvt = authctx.useAxiosPrivate();
		const controller = new AbortController();
		axios
			.get(
				`orders/order-summary/${orderId}`,
				{
					signal: controller.signal,
				},
				{ controller: controller.signal }
			)
			.then(response => {
				if (!response?.data?.error) {
					let { data } = response;
					let { title, SAC } = data.service;
					let {
						orderDescription,
						value,
						user,
						paymentStatus,
						discount,
						invoiceNumber,
						invoiceDate,
					} = data;
					setEmail(user.email);
					setInvoiceNumber(invoiceNumber);
					setOrderValue(value);
					setAddress(prevState => {
						return {
							...prevState,
							fName: user.address.fName,
							lName: user.address.lName,
							adl1: user.address.adl1,
							adl2: user.address.adl2,
							state: user.address.state,
							phoneNo: user.address.phoneNo,
							zipcode: user.address.zipcode,
							city: user.address.city,
							invoiceType: user.address.invoiceType,
						};
					});
					setInvoiceDate(invoiceDate);

					if (user.address.state === 'TN') {
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
											ILAMURUGU &amp; ASSOCIATES
											<br />
										</h2>
										<span className='small'>
											<b>INVOICE :</b>{' '}
											{invoiceNumber ? (
												<Fade in={true} timeout={1000}>
													<i># {invoiceNumber}</i>
												</Fade>
											) : (
												<Skeleton
													variant='rectangular'
													width={100}
													sx={{ borderRadius: 2, display: 'inline-block' }}
												/>
											)}
										</span>
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
										Flat No 23, Sri Iyappa Flats,
										<br />
										New No 5 old 3 Ramachandra road,
										<br /> Mylapore,
										<br />
										<b>City: </b>
										Chennai
										<br />
										<b>State: </b>
										Tamil Nadu
										<br />
										<b>Pincode: </b>600004
										<br />
										<b>Phone number:</b> (+91) 7200190475
										<br />
										<b>GSTIN:</b> 33AAEFI2547J1ZG
									</address>
									<br />
									<address style={{ lineHeight: '2rem' }}>
										<strong style={{ fontSize: '1rem' }}>Payment Method</strong>
										<br />
										{paymentStatus ? (
											<Fade in={true} timeout={1000}>
												<Chip
													size='small'
													color={paymentStatus === 'PAID' ? 'info' : 'warning'}
													label={
														paymentStatus === 'PAID'
															? 'Razorpay'
															: 'Not Applicable'
													}
													icon={
														paymentStatus === 'PAID' ? (
															<PaidIcon />
														) : (
															<MoneyOffCsredIcon />
														)
													}
												/>
											</Fade>
										) : (
											<Skeleton
												variant='rectangular'
												width={100}
												height={25}
												sx={{ borderRadius: 3 }}
											/>
										)}

										<br />
										{email}
										<br />
									</address>
								</div>
								<div className='col-6'>
									<address>
										<strong className='d-block'>BILLING ADDRESS:</strong>
										<br />
										<b>Name: </b>
										{address.invoiceType ? (
											address.invoiceType === 'personal' ? (
												<Fade in={true} timeout={1000}>
													<span className='mb-0'>
														<br />
														{`${address.fName} ${address.lName}`}
													</span>
												</Fade>
											) : (
												<Fade in={true} timeout={1000}>
													<span className='mb-0'>
														<br />
														{address.fName}
														<br />
														<b>GSTIN : </b>
														{address.lName}
													</span>
												</Fade>
											)
										) : (
											<Skeleton
												variant='rectangular'
												width={100}
												sx={{ borderRadius: 1 }}
											/>
										)}
										<br />
										<b>Phone number: </b>
										{address.phoneNo ? (
											<Fade in={true} timeout={1000}>
												<span>{address.phoneNo}</span>
											</Fade>
										) : (
											<Skeleton
												variant='rectangular'
												width={100}
												sx={{ borderRadius: 2, display: 'inline-block' }}
											/>
										)}
										{}
										<br />
										<b>Address: </b>
										{address.adl1 ? (
											<Fade in={true} timeout={1000}>
												<span>{address.adl1}</span>
											</Fade>
										) : (
											<Skeleton
												variant='rectangular'
												width={100}
												sx={{ borderRadius: 2, display: 'inline-block' }}
											/>
										)}
										<br />
										{address.adl2 ? (
											<Fade in={true} timeout={1000}>
												<span>{address.adl2}</span>
											</Fade>
										) : (
											<Skeleton
												variant='rectangular'
												width={100}
												sx={{ borderRadius: 2, display: 'inline-block' }}
											/>
										)}
										<br />
										<b>City: </b>
										{address.city ? (
											<Fade in={true} timeout={1000}>
												<span>{address.city}</span>
											</Fade>
										) : (
											<Skeleton
												variant='rectangular'
												width={100}
												sx={{ borderRadius: 2, display: 'inline-block' }}
											/>
										)}
										<br />
										<b>State: </b>
										{address.state ? (
											<Fade in={true} timeout={1000}>
												<span>{address.state}</span>
											</Fade>
										) : (
											<Skeleton
												variant='rectangular'
												width={100}
												sx={{ borderRadius: 2, display: 'inline-block' }}
											/>
										)}
										<br />
										<b>Pincode: </b>
										{address.zipcode ? (
											<Fade in={true} timeout={1000}>
												<div>{address.zipcode}</div>
											</Fade>
										) : (
											<Skeleton
												variant='rectangular'
												width={100}
												sx={{ borderRadius: 2 }}
											/>
										)}
										<br />
									</address>
									<br />
									<address>
										<strong>Invoice generated on:</strong>
										<br />
										{invoiceDate !== 'NA' && invoiceDate
											? format(new Date(invoiceDate.toString()), 'do MMMM yyyy')
											: 'NA'}
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
													{serviceTitle ? (
														<Fade in={true} timeout={1000}>
															<span>
																<strong>{serviceTitle}</strong>
																<br />
																{orderDesc}
															</span>
														</Fade>
													) : (
														<Skeleton
															variant='rectangular'
															width={200}
															height={40}
															sx={{ borderRadius: 1 }}
														/>
													)}
												</td>
												<td className='text-end'>{sac}</td>

												<td className='text-end'>
													{orderDiscount !== 0 && serviceTitle && (
														<>
															<Fade in={true} timeout={1000}>
																<b>{orderDiscount}%</b>
															</Fade>
															<br />
														</>
													)}
													{serviceTitle && orderDiscount === 0 && 'NA'}
													{!serviceTitle && (
														<Skeleton
															variant='rectangular'
															width={100}
															sx={{ borderRadius: 2 }}
														/>
													)}
												</td>
												<td className='text-end'>
													<Fade
														in={
															parseFloat(price.basePrice) !== 0 ? true : false
														}
														timeout={1000}>
														<span>
															{price.basePrice}₹<br />
															<small className='text-success'>
																-{price.discountValue}₹
															</small>
														</span>
													</Fade>
												</td>
											</tr>

											<tr>
												<td colSpan='3'></td>
												<td className='text-end'>
													<Fade
														in={
															parseFloat(price.basePrice) !== 0 ? true : false
														}
														transition={1000}>
														<strong>
															{taxType}
															<strong> (18%) </strong>
														</strong>
													</Fade>
												</td>
												<td className='text-end'>
													<Fade
														in={
															parseFloat(price.basePrice) !== 0 ? true : false
														}
														transition={1000}>
														<small>+{price.taxValue}₹ </small>
													</Fade>
												</td>
											</tr>
											<tr>
												<td colSpan='3'></td>
												<td className='text-end'>
													<strong>Total</strong>
												</td>
												<td className='text-end'>
													<Fade
														in={
															parseFloat(price.basePrice) !== 0 ? true : false
														}
														transition={1000}>
														<strong>{orderValue}₹</strong>
													</Fade>
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
										<Link to='/terms-of-use'>Terms and Conditions</Link>{' '}
										mentioned on the website{' '}
										<Link to='/'>https://www.ilamsca.com</Link>
										<br />
									</p>
									<small className='ml-0'>
										<b>This invoice is</b>
									</small>
									{address.adl1 ? (
										<Chip
											label={paymentStatus}
											color={paymentStatus === 'PAID' ? 'success' : 'error'}
											size='small'
											sx={{ ml: 2 }}
											icon={
												paymentStatus === 'PAID' ? (
													<PaidIcon />
												) : (
													<MoneyOffCsredIcon />
												)
											}
										/>
									) : (
										<Skeleton
											variant='rectangular'
											width={100}
											height={25}
											sx={{
												borderRadius: 3,
												display: 'inline-block',
												mx: 2,
											}}
										/>
									)}
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
