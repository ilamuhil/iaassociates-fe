import React, { Component } from 'react';
import { Layout } from '../components/Layout';
import './../styles/css/checkout.css';
import AuthContext from '../context/AuthProvider';
import { Link } from 'react-router-dom';
import { axiosPrivate } from '../api/axios';

export class Checkout extends Component {
	constructor(props) {
		super(props);
		this.fNameRef = React.createRef();
		this.lNameRef = React.createRef();
		this.state = {
			serviceName: 'GST SERVICE',
			shortDesc:
				'Monthly GST Filing non recurring for one month only, subscribe for greater amount to buy some more and drink',
			price: 3000,
			company: {
				reqGstInvoice: 0,
				name: ['First Name', 'Company/Firm Name'],
				number: ['Last Name', 'GSTIN Number'],
				pname: ['Michael', 'Bharat Sanchar Nigam Ltd'],
				pnumber: ['Scott', '33AAQFC5091H1ZA'],
			},
			displayLoginAlert: false,
			formdata: {
				firstName: '',
				lastName: '',
				phoneNo: 0,
				email: '',
				companyName: '',
				gstin: '',
				adl1: '',
				adl2: '',
				invoiceType: 'personal',
				city: '',
				state: '',
				zipcode: 0,
				serviceId: 0,
				plan: 1,
			},
			savedAddresses: null,
			displaySavedAddresses: false,
			controller: new AbortController(),
		};
	}

	loadScript = src => {
		return new Promise(resolve => {
			const script = document.createElement('script');
			script.src = src;
			script.onload = () => {
				resolve(true);
			};
			script.onerror = () => {
				resolve(false);
			};
			document.body.appendChild(script);
		});
	};
	getAddresses = () => {
		return new Promise(async (resolve, reject) => {
			let resp;
			try {
			} catch (e) {
				console.log(e);
			}
			let { addresses } = resp.data;
			if (addresses) {
				this.setState({ savedAddresses: addresses });
			} else {
				let { error } = resp?.data;
				reject(error);
			}
		});
	};
	componentDidMount() {
		this.loadScript('https://checkout.razorpay.com/v1/checkout.js');
		axiosPrivate
			.get('/getAddresses', {
				signal: this.state.controller.signal,
			})
			.then(res => {
				let { addresses } = res.data;
				this.setState({
					savedAddresses: addresses,
					displaySavedAddresses: true,
				});
			})
			.cath(e => {
				console.error(e);
			});
	}
	componentWillUnmount() {
		this.state.controller.abort();
	}
	checkout = async () => {
		let authctx = this.context;
		let orderRequestbody = { email: this.state.formdata.email };
		this.state.formdata.invoiceType === 'personal'
			? this.setState(prevState => ({
					formdata: {
						...prevState.formdata,
						firstName: this.fNameRef.current.value,
					},
			  }))
			: this.setState(prevState => ({
					formdata: {
						...prevState.formdata,
						companyName: this.fNameRef.current.value,
					},
			  }));
		this.state.formdata.invoiceType === 'personal'
			? this.setState(prevState => ({
					formdata: {
						...prevState.formdata,
						lastName: this.lNameRef.current.value,
					},
			  }))
			: this.setState(prevState => ({
					formdata: {
						...prevState.formdata,
						gstin: this.lNameRef.current.value,
					},
			  }));

		let order = await authctx
			.useAxiosPrivate()
			.post('/orders', orderRequestbody);
		let { id, amount, currency } = order.data;
		let name =
			this.state.invoiceType === 'personal'
				? `${this.state.formdata.firstName} ${this.state.formdata.lastName}`
				: this.state.formdata.companyName;
		let options = {
			key: 'rzp_test_V00iJCr4eSlZur',
			amount,
			currency,
			name,
			description: 'Test Transaction',
			order_id: id,
			handler: function (response) {
				alert(response.razorpay_payment_id);
				alert(response.razorpay_order_id);
				alert(response.razorpay_signature);
			},
			callback_url: 'http://localhost:8000/orders/order-status/',
			redirect: true,
			prefill: {
				name,
				email: this.state.email,
				contact: this.state.phoneNo,
			},
			notes: {
				address: 'Razorpay Corporate Office',
			},
			theme: {
				color: '#3399cc',
			},
		};

		const paymentObject = new window.Razorpay(options);
		paymentObject.open();
	};
	enablepayment = () => {
		const authctx = this.context;
		if (authctx.isLoggedIn) {
			return (
				<div className='d-flex justify-content-center'>
					<button
						className='w-100 py-2 border-2 payment-button'
						onClick={e => {
							this.checkout();
						}}>
						Pay now
					</button>
				</div>
			);
		}
		return (
			<div className='d-flex justify-content-center'>
				<Link
					className='w-100 py-2 border-2 payment-button text-center text-black'
					to='/login'
					disabled>
					Login to Continue
				</Link>
			</div>
		);
	};

	calculateTaxAndTotal = priceOfService => [
		Math.round((18 / 100) * priceOfService * 100) / 100,
		Math.round((18 / 100) * priceOfService * 100) / 100 + priceOfService,
	];
	companyInvoice(e) {
		if (!e.target.defaultChecked) {
			this.setState(prevState => ({
				company: { ...prevState.company, reqGstInvoice: 1 },
			}));
			this.setState(prevState => ({
				formdata: { ...prevState.formdata, invoiceType: 'company' },
			}));
		} else {
			this.setState(prevState => ({
				company: { ...prevState.company, reqGstInvoice: 0 },
			}));
			this.setState(prevState => ({
				formdata: { ...prevState.formdata, invoiceType: 'personal' },
			}));
		}
	}
	render() {
		let [tax, total] = this.calculateTaxAndTotal(3000);
		let authctx = this.context;
		return (
			<Layout>
				<div className='container'>
					<h1 className='text-center checkout-heading h1'>Quick Checkout</h1>

					<div className='row mb-4'>
						<div className='col-lg-8'>
							{!authctx.isLoggedIn && (
								<div className='alert alert-warning shadow-lg' role='alert'>
									<Link to='/login' className='alert-link px-2 py-1 text-black'>
										Login or Create an account
									</Link>
									to continue checkout{' '}
								</div>
							)}

							<div className='bg-white shadow-lg content-wrapper px-4 billing-info'>
								<h2 className='h1'>Billing Information</h2>

								<form className='p-0 m-0'>
									<div className='row justify-content-start'>
										<div className='mb-3 col-md-6'>
											<label
												htmlFor='gstcheckbox'
												className='form-label d-block'>
												{
													this.state.company.name[
														this.state.company.reqGstInvoice
													]
												}
											</label>
											<input
												type='text'
												className='form-control  shadow-sm border rounded-3'
												name={
													this.state.company.name[
														this.state.company.reqGstInvoice
													]
												}
												id='gstcheckbox'
												placeholder={
													this.state.company.pname[
														this.state.company.reqGstInvoice
													]
												}
												ref={this.fNameRef}
											/>
										</div>
										<div className='mb-3 col-md-6 '>
											<label
												htmlFor='gstinvoice'
												className='form-label d-block'>
												{
													this.state.company.number[
														this.state.company.reqGstInvoice
													]
												}
											</label>
											<input
												type='text'
												className='form-control shadow-sm border'
												name={
													this.state.company.number[
														this.state.company.reqGstInvoice
													]
												}
												id='gstinvoice'
												placeholder={
													this.state.company.pnumber[
														this.state.company.reqGstInvoice
													]
												}
												ref={this.lNameRef}
											/>
										</div>
									</div>
									<div className='row'>
										<div className='mb-3 col-md-6'>
											<label htmlFor='email' className='form-label d-block'>
												Email Address
											</label>
											<input
												type='email'
												className='form-control   shadow-sm border'
												name='email'
												id='email'
												onChange={e => {
													this.setState(prevState => ({
														formdata: {
															...prevState.formdata,
															email: e.target.value,
														},
													}));
												}}
												placeholder='example@example.com'
											/>
										</div>
										<div className='mb-3 col-md-6'>
											<label htmlFor='' className='form-label d-block'>
												Phone No
											</label>
											<input
												type='tel'
												className='form-control   shadow-sm border'
												name='phoneNo'
												id='phoneNo'
												placeholder='9876543210'
												onChange={e => {
													this.setState(prevState => ({
														formdata: {
															...prevState.formdata,
															phoneNo: e.target.value,
														},
													}));
												}}
											/>
										</div>
									</div>
									<div className='row'>
										<div className='mb-3'>
											<label htmlFor='addressline1' className='form-label'>
												Address Line 1
											</label>
											<input
												className='form-control shadow-sm border'
												name='address'
												id='addressline1'
												rows='2'
												onChange={e => {
													this.setState(prevState => ({
														formdata: {
															...prevState.formdata,
															adl1: e.target.value,
														},
													}));
												}}></input>
										</div>
										<div className='mb-3'>
											<label htmlFor='addressline2' className='form-label'>
												Address Line 2
											</label>
											<input
												className='form-control shadow-sm border'
												name='address'
												id='addressline2'
												rows='2'
												onChange={e => {
													this.setState(prevState => ({
														formdata: {
															...prevState.formdata,
															adl2: e.target.value,
														},
													}));
												}}></input>
										</div>
									</div>
									<div className='row'>
										<div className='mb-3 col-md-6'>
											<label htmlFor='' className='form-label'>
												City
											</label>
											<input
												className='form-control shadow-sm border'
												name='city'
												id='city'
												type='text'
												onChange={e => {
													this.setState(prevState => ({
														formdata: {
															...prevState.formdata,
															city: e.target.value,
														},
													}));
												}}
											/>
										</div>
										<div className='mb-3 col-md-6'>
											<label htmlFor='indian-states' className='form-label'>
												State
											</label>
											<select
												id='indian-states'
												name='indian-state'
												className='form-control shadow-sm border'>
												<option value='NA'>Select a state</option>
												<option value='AN'>Andaman and Nicobar Islands</option>
												<option value='AP'>Andhra Pradesh</option>
												<option value='AR'>Arunachal Pradesh</option>
												<option value='AS'>Assam</option>
												<option value='BR'>Bihar</option>
												<option value='CH'>Chandigarh</option>
												<option value='CT'>Chhattisgarh</option>
												<option value='DN'>Dadra and Nagar Haveli</option>
												<option value='DD'>Daman and Diu</option>
												<option value='DL'>Delhi</option>
												<option value='GA'>Goa</option>
												<option value='GJ'>Gujarat</option>
												<option value='HR'>Haryana</option>
												<option value='HP'>Himachal Pradesh</option>
												<option value='JK'>Jammu and Kashmir</option>
												<option value='JH'>Jharkhand</option>
												<option value='KA'>Karnataka</option>
												<option value='KL'>Kerala</option>
												<option value='LA'>Ladakh</option>
												<option value='LD'>Lakshadweep</option>
												<option value='MP'>Madhya Pradesh</option>
												<option value='MH'>Maharashtra</option>
												<option value='MN'>Manipur</option>
												<option value='ML'>Meghalaya</option>
												<option value='MZ'>Mizoram</option>
												<option value='NL'>Nagaland</option>
												<option value='OR'>Odisha</option>
												<option value='PY'>Puducherry</option>
												<option value='PB'>Punjab</option>
												<option value='RJ'>Rajasthan</option>
												<option value='SK'>Sikkim</option>
												<option value='TN'>Tamil Nadu</option>
												<option value='TG'>Telangana</option>
												<option value='TR'>Tripura</option>
												<option value='UP'>Uttar Pradesh</option>
												<option value='UT'>Uttarakhand</option>
												<option value='WB'>West Bengal</option>
											</select>
										</div>
									</div>
									<div className='row flex-wrap-reverse'>
										<div className='col-md-6'>
											<div className='form-check my-3'>
												<input
													type='checkbox'
													className='form-check-input'
													name='gstInvoice'
													id='gstInvoice'
													defaultChecked={Boolean(
														this.state.company.reqGstInvoice
													)}
													value='0'
													onChange={e => this.companyInvoice(e)}
												/>
												<label
													className='form-check-label'
													htmlFor='gstInvoice'>
													Need a GST Invoice for your Company?
												</label>
											</div>
										</div>
										<div className='mb-3 col-md-6'>
											<label htmlFor='pincode' className='form-label d-block'>
												Pincode
											</label>
											<input
												type='number'
												className='form-control shadow-sm border'
												name='pincode'
												id='pincode'
												aria-describedby='helpId'
												placeholder='741246'
												onChange={e => {
													this.setState(prevState => ({
														formdata: {
															...prevState.formdata,
															zipcode: e.target.value,
														},
													}));
												}}
											/>
										</div>
									</div>
								</form>
							</div>
						</div>
						<div className='col-lg-4'>
							<div className='bg-white shadow-lg p-4 content-wrapper'>
								<h4 className='mb-4'>Service Details</h4>

								<ul>
									<li className='d-flex flex-row justify-content-between'>
										<img
											src={require('./../img/i-a inspirations.library/images/KZH71LA1413M4.info/Meeting Icons - 14,249 free icons.png')}
											alt='service img thumbnail'
											className='service-img-thumbnail'
										/>
										<div className='px-4'>
											<h6>{this.state.serviceName}</h6>
											<p className='service-desc'>{this.state.shortDesc}</p>
										</div>
										<div>
											<p className='text-right price'>
												<span>
													<i>₹</i>
												</span>
												{this.state.price}
											</p>
										</div>
									</li>
								</ul>
								<div className='py-2 mt-2'>
									<p className='d-flex w-100 justify-content-between border-bottom pb-3'>
										<span className='text-start other-charges'>
											Tax : 18% GST
										</span>
										<span className='other-charges charge-value'>₹ {tax}</span>
									</p>
									<p className='d-flex w-100 justify-content-between mt-2'>
										<span className='text-start text-capitalize other-charges'>
											Payable amount :
										</span>
										<span className='other-charges charge-value'>
											₹ {total}
										</span>
									</p>
									{this.enablepayment()}
								</div>
							</div>
						</div>
					</div>
				</div>
			</Layout>
		);
	}
}
Checkout.contextType = AuthContext;
export default Checkout;
