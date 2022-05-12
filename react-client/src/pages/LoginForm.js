import './../styles/css/LoginForm.css';
import loginImg from './../img/loginImage.webp';
import React, { Component } from 'react';
import { Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Layout } from './../components/UtilitiesAndWrappers/Layout';
import { Link } from 'react-router-dom';
import BreadCrumbs from './../components/UtilitiesAndWrappers/Breadcrumbs';
import axios from './../api/axios';
import AuthContext from '../context/AuthProvider';


export default class LoginForm extends Component {
	constructor(props) {
		super(props);
		this.state = {
			redirectUrl: false,
			loginSignUpMessage: ["Don't have an account?", 'Register', 'in'],
			isRegister: false,
			rememberMe: false,
			formToggleVisibility: 'd-none',
			forgotPwdVisibility: '',
			controller: new AbortController(),
			userLogin: {
				email: '',
				password: '',
			},
			userRegister: {
				username: '',
				password: '',
				confirmpassword: '',
				email: '',
			},
			errorMessage: '',
			isLoggedIn: {},
		};
	}
	componentWillUnmount() {
		//performing request cleanup
		this.state.controller.abort();
	}
	displayLoginFormContent = e => {
		e.preventDefault();
		this.setState({ isRegister: !this.state.isRegister });
		if (this.state.formToggleVisibility === 'd-none') {
			this.setState({
				formToggleVisibility: '',
				forgotPwdVisibility: 'd-none',
				loginSignUpMessage: ['Already have an account?', 'Login', 'up'],
			});
		} else {
			this.setState({
				formToggleVisibility: 'd-none',
				forgotPwdVisibility: '',
				loginSignUpMessage: ["Don't have an account?", 'Register', 'in'],
			});
		}
	};

	validate = async e => {
		let authctx = this.context;
		e.preventDefault();
		let data = {};
		let requestroute = 'authenticate';
		if (this.state.isRegister === true) {
			//check if there are any empty fields and show notification before form submission
			for (const key in this.state.userRegister) {
				if (this.state.userRegister[key] === '') {
					toast.info(`Please fill in the empty field(s)`, {
						toastId: 'empty fields',
					});
					return;
				}
			}
			// Check if password matches conf password and show approprare error before form submission
			if (
				this.state.userRegister.password !==
				this.state.userRegister.confirmpassword
			) {
				toast.info('your passwords do not match', { toastId: 'unMatched pwd' });
				return;
			}
			data = {
				...data,
				userRegister: this.state.userRegister,
				rememberMe: this.state.rememberMe,
			};
			requestroute += '/register';
		} else {
			for (const key in this.state.userLogin) {
				if (this.state.userLogin[key] === '') {
					toast.info(`Please fill in the empty field(s)`);
					return;
				}
			}
			data = {
				...data,
				userLogin: this.state.userLogin,
				rememberMe: this.state.rememberMe,
			};
			requestroute += '/login';
		}
		let options = {
			headers: { 'content-type': 'application/json' },
			withCredentials: true,
		};
		let loggingtoast = toast.loading('Loading...');
		try {
			let res = await axios.post(
				`http://localhost:8000/${requestroute}`,
				data,
				options
			);
			if (res.status === 200) {
				toast.update(loggingtoast, {
					render: res.data,
					type: 'success',
					isLoading: false,
					autoClose: 1500,
				});
				if (!requestroute.match(/register/)) {
					authctx.login();
					this.setState({ redirect: true });
				}
			}
		} catch (err) {
			let restxt = err.response
				? err.response.data
				: 'Server down. Try again later';

			toast.update(loggingtoast, {
				render: restxt,
				type: 'error',
				isLoading: false,
				autoClose: 2000,
			});
		}
	};
	render() {
		let authctx = this.context;
		if (authctx.isLoggedIn) {
			return <Navigate to='/dashboard/profile' replace={true} />;
		}
		return (
			<Layout>
				<BreadCrumbs pageName='Login or Register' />
				<section id='signInSection'>
					<div className='container py-4'>
						<div className='row d-flex justify-content-center align-items-center h-100'>
							<div className='col-md-9 col-lg-6 col-xl-5'>
								<img src={loginImg} className='img-fluid' alt='Login' />
							</div>
							<div className='col-md-8 col-lg-6 col-xl-4 offset-xl-1'>
								<form>
									<div className='d-flex flex-row align-items-center justify-content-center justify-content-lg-start'>
										<h1 className='fw-normal mb-0 me-3'>
											Sign {this.state.loginSignUpMessage[2]}
										</h1>
									</div>

									<div className='divider d-flex align-items-center my-4'>
										<p className='text-center fw-bold mx-3 mb-0'>Or</p>
									</div>
									<div className='form-outline mb-4'>
										<input
											type='text'
											id='username'
											className={
												'form-control ' + this.state.formToggleVisibility
											}
											required
											placeholder='Enter Username'
											onChange={e => {
												this.setState({
													userRegister: {
														...this.state.userRegister,
														username: e.target.value,
													},
												});
											}}
										/>
									</div>

									<div className='form-outline mb-4'>
										<input
											type='email'
											id='email'
											className='form-control'
											required
											placeholder='Email Address'
											onChange={e => {
												if (!this.state.isRegister) {
													this.setState({
														userLogin: {
															...this.state.userLogin,
															email: e.target.value,
														},
													});
												} else {
													this.setState({
														userRegister: {
															...this.state.userRegister,
															email: e.target.value,
														},
													});
												}
											}}
										/>
									</div>

									<div className='form-outline mb-3'>
										<input
											type='password'
											id='password'
											className='form-control'
											placeholder='Enter Password'
											required
											onChange={e => {
												if (!this.state.isRegister) {
													this.setState({
														userLogin: {
															...this.state.userLogin,
															password: e.target.value,
														},
													});
												} else {
													this.setState({
														userRegister: {
															...this.state.userRegister,
															password: e.target.value,
														},
													});
												}
											}}
										/>
									</div>
									<div className='form-outline mb-4'>
										<input
											type='password'
											className={
												'form-control ' + this.state.formToggleVisibility
											}
											required
											placeholder='Confirm Password'
											onChange={e => {
												this.setState({
													userRegister: {
														...this.state.userRegister,
														confirmpassword: e.target.value,
													},
												});
											}}
										/>
									</div>

									<div className='d-flex justify-content-between align-items-center'>
										<div
											className={`form-check mb-0 ${
												!this.state.isRegister ? 'd-none' : ''
											}`}>
											<input
												className={`form-check-input me-2`}
												type='checkbox'
												checked
												id='form2Example3'
												onChange={e =>
													this.setState(prevState => ({
														rememberMe: !prevState.rememberMe,
													}))
												}
											/>
											<small
												className='form-check-label'
												htmlFor='form2Example3'>
												By creating an account I agree to Terms and Conditions
												of Service
											</small>
										</div>
										<Link
											to='/reset-password-email'
											className={'text-body ' + this.state.forgotPwdVisibility}>
											<small>Forgot password?</small>
										</Link>
									</div>

									<div className='text-center text-lg-start'>
										<button
											type='submit'
											className='btn btn-primary '
											style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
											onClick={e => this.validate(e)}>
											Enter
										</button>
										<p className='small fw-bold mt-4 pt-1 mb-0'>
											{this.state.loginSignUpMessage[0]}{' '}
											<button
												className='link-danger border-0 bg-white text-underline'
												onClick={this.displayLoginFormContent}>
												{this.state.loginSignUpMessage[1]}
											</button>
										</p>
									</div>
								</form>
							</div>
						</div>
					</div>
				</section>
			</Layout>
		);
	}
}
LoginForm.contextType = AuthContext;
