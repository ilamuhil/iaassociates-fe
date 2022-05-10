import React, { Component } from 'react';
import './../styles/css/contact.css';
import { Layout } from './../components/UtilitiesAndWrappers/Layout';
import BreadCrumbs from './../components/UtilitiesAndWrappers/Breadcrumbs';
import axios from '../api/axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useServices from '../hooks/useServices';
class Contact extends Component {
	constructor(props) {
		super(props);
		this.state = {
			name: '',
			email: '',
			message: '',
			serviceName: '',
			phoneNumber: 0,
		};
	}
	submitForm = async e => {
		e.preventDefault();

		for (let key in this.state) {
			if (this.state[key] === '') {
				toast.warn(`${key} field is empty`);
				return;
			}
		}
		const id = toast.loading('Submitting your message');
		try {
			let formSubmit = await axios.post('/contact', this.state);
			toast.update(id, {
				render: formSubmit.data,
				type: 'success',
				isLoading: false,
				autoClose: 1500,
			});
			this.setState({
				name: '',
				email: '',
				message: '',
				serviceName: '',
				phoneNumber: '',
			});
		} catch (e) {
			if (e.response) {
				toast.update(id, {
					render: e.response.data,
					type: 'error',
					isLoading: false,
					autoClose: 1500,
				});
			} else {
				toast.update(id, {
					render: 'Server unavailable! Try again later',
					type: 'error',
					isLoading: false,
					autoClose: 1500,
				});
			}
		}
	};
	render() {
		return (
			<Layout>
				<BreadCrumbs pageName='Contact' />
				<div className='contactSection container'>
					<div className='row justify-content-center mx-1 mx-md-2 mx-md-0'>
						<div className='col-lg-6 col-md-8 col-sm-10 contact-form mx-auto mx-lg-0'>
							<div className='row py-4'>
								<div className='col-6 col-lg-9 justify-content-center mx-auto mx-lg-0'>
									<h1 className='text-start'>Contact Us</h1>
								</div>

								<div className='col-4 offset-2 offset-lg-0 col-lg-3'>
									<svg
										xmlns='http://www.w3.org/2000/svg'
										data-name='Layer 1'
										viewBox='0 0 512 512'>
										<rect
											width='355'
											height='497'
											x='78.5'
											y='7.5'
											fill='#83c9ee'
											rx='30'
										/>
										<path
											fill='#52bbe9'
											d='M403.50006,7.5h-45a30.00012,30.00012,0,0,1,30,30v437a30.00012,30.00012,0,0,1-30,30h45a30.00012,30.00012,0,0,0,30-30V37.5A30.00012,30.00012,0,0,0,403.50006,7.5Z'
										/>
										<path
											fill='#eb304a'
											d='M302.56346,382.58051H209.43654a42.64962,42.64962,0,0,1-42.64962-42.64962v-.00008a55.90009,55.90009,0,0,1,29.609-49.3315L256,258.83344l59.60411,31.76587a55.90009,55.90009,0,0,1,29.609,49.3315v.00008A42.64962,42.64962,0,0,1,302.56346,382.58051Z'
										/>
										<path
											fill='#e4222e'
											d='M315.60407,290.5993l-59.604-31.76586-22.5,11.99133,37.104,19.77453A55.89984,55.89984,0,0,1,300.213,339.93079v.00012a42.64948,42.64948,0,0,1-42.64941,42.6496h45a42.64948,42.64948,0,0,0,42.64941-42.6496v-.00012A55.89984,55.89984,0,0,0,315.60407,290.5993Z'
										/>
										<path
											fill='#fdd8ae'
											d='M283.85016,241.66V266.03a27.37012,27.37012,0,0,1-54.74023,0V241.66A3.329,3.329,0,0,1,232.44,238.33h48.08008A3.329,3.329,0,0,1,283.85016,241.66Z'
										/>
										<path
											fill='#fbbf7d'
											d='M283.85016,241.66v21.4a53.89746,53.89746,0,0,1-54.74023.56V241.66A3.329,3.329,0,0,1,232.44,238.33h48.08008A3.329,3.329,0,0,1,283.85016,241.66Z'
										/>
										<path
											fill='#fdd8ae'
											d='M309.85993,183.27v18.68a53.85987,53.85987,0,1,1-107.71973,0V183.27a53.85987,53.85987,0,0,1,107.71973,0Z'
										/>
										<path
											fill='#fbbf7d'
											d='M294.08014,145.19a53.84769,53.84769,0,0,0-53.08057-13.63684A53.851,53.851,0,0,1,279.85993,183.27v18.68a53.88042,53.88042,0,0,1-38.85987,51.72608A53.85081,53.85081,0,0,0,309.85993,201.95V183.27A53.68169,53.68169,0,0,0,294.08014,145.19Z'
										/>
										<path
											fill='#57565c'
											d='M309.85993,183.27v5.23l-.00977.03a77.41184,77.41184,0,0,1-47.1499,3.13995A76.01052,76.01052,0,0,1,232.44,175.96a24.9755,24.9755,0,0,1-7.31982,12.29c-9.25,8.35-21.48,6.05-22.97022,5.74l-.00976-.02v-10.7a53.85987,53.85987,0,0,1,107.71973,0Z'
										/>
										<path
											fill='#3c3b41'
											d='M309.85993,183.27v5.23l-.00977.03a78.78569,78.78569,0,0,1-29.99023,5.45V183.27a53.86084,53.86084,0,0,0-38.85987-51.72c.6001-.17,1.18994-.34,1.79981-.49a53.01237,53.01237,0,0,1,5.53027-1.09q.94482-.135,1.88965-.24c.54-.06,1.09033-.11,1.64014-.15.18017-.02.35986-.03.54-.04.38038-.03.77-.05,1.16016-.06.31982-.02.6499-.03.98-.04.48-.01.96973-.02,1.46-.02a53.85889,53.85889,0,0,1,53.85987,53.85Z'
										/>
										<path
											fill='#787681'
											d='M55.5,176h39a15,15,0,0,1,15,15v0a15,15,0,0,1-15,15h-39a15,15,0,0,1-15-15v0a15,15,0,0,1,15-15Z'
										/>
										<path
											fill='#57565c'
											d='M94.50006,176h-30a15,15,0,1,1,0,30h30a15,15,0,1,0,0-30Z'
										/>
										<path
											fill='#787681'
											d='M55.5,306h39a15,15,0,0,1,15,15v0a15,15,0,0,1-15,15h-39a15,15,0,0,1-15-15v0a15,15,0,0,1,15-15Z'
										/>
										<path
											fill='#57565c'
											d='M94.50006,306h-30a15,15,0,1,1,0,30h30a15,15,0,1,0,0-30Z'
										/>
										<rect
											width='69'
											height='30'
											x='40.5'
											y='46'
											fill='#787681'
											rx='15'
										/>
										<path
											fill='#57565c'
											d='M94.50006,46h-30a15,15,0,0,1,0,30h30a15,15,0,1,0,0-30Z'
										/>
										<path
											fill='#787681'
											d='M55.5,436h39a15,15,0,0,1,15,15v0a15,15,0,0,1-15,15h-39a15,15,0,0,1-15-15v0a15,15,0,0,1,15-15Z'
										/>
										<path
											fill='#57565c'
											d='M94.50006,436h-30a15,15,0,0,1,0,30h30a15,15,0,0,0,0-30Z'
										/>{' '}
									</svg>
								</div>
							</div>

							<form className='contact-form-element'>
								<div className='row'>
									<div className='col-sm-6'>
										<div className='mb-3'>
											<label htmlFor='email'>Email address</label>
											<input
												type='email'
												className='form-control'
												id='email'
												required
												onChange={e => {
													this.setState({ email: e.target.value });
												}}
											/>
										</div>
									</div>
									<div className='col-sm-6'>
										<div className='mb-3'>
											<label htmlFor='name'>Your Name</label>
											<input
												type='text'
												className='form-control'
												id='name'
												required
												onChange={e => {
													this.setState({ name: e.target.value });
												}}
											/>
										</div>
									</div>
								</div>
								<div className='form-group mb-3'>
									<label className='text-bold' htmlFor='serviceType'>
										Service Type
									</label>
									<select
										aria-label='Default select example'
										id='serviceType'
										className='form-select text-muted'
										onChange={e => {
											this.setState({ serviceName: e.target.value });
										}}>
										<option disabled>Service You Wish to Enquire About</option>
										{this.props.services &&
											this.props.services.map(service => (
												<option value={service.title} key={service.id}>
													{service.title}
												</option>
											))}
										<option value='other'>Other</option>
									</select>
									.
								</div>

								<div className='mb-3'>
									<label htmlFor='phoneNumber'>Phone Number</label>
									<input
										type='text'
										className='form-control'
										id='phoneNumber'
										required
										onChange={e => {
											this.setState({ phoneNumber: e.target.value });
										}}
									/>
								</div>

								<div className='form-floating'>
									<textarea
										className='form-control'
										placeholder='Drop your message'
										id='Message'
										required
										onChange={e => {
											this.setState({ message: e.target.value });
										}}></textarea>
									<label htmlFor='Message' className='text-muted'>
										Drop your message and we will reply at the earliest 🙂
									</label>
								</div>

								<div>
									<button
										type='submit'
										onClick={e => {
											this.submitForm(e);
										}}>
										Send Message
									</button>
								</div>
							</form>
						</div>
					</div>
				</div>
			</Layout>
		);
	}
}

const wrapperHoc = Component => {
	return () => {
		const services = useServices();
		return <Component services={services} />;
	};
};
export default wrapperHoc(Contact);
