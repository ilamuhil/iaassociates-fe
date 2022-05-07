import React, { useContext, useState } from 'react';
import AuthContext from '../../context/AuthProvider';
import { Link } from 'react-router-dom';
const Footer = () => {
	const ctx = useContext(AuthContext);
	return (
		<footer id='footer'>
			{!ctx.isLoggedIn && ctx.userRole !== 33 && <NewsLetter />}
			<div className='footer-top'>
				<div className='container'>
					<div className='row'>
						<div className='col-lg-3 col-md-6 footer-contact'>
							<h3
								style={{
									fontFamily:
										'Baskerville, Baskerville Old Face, Garamond, Times New Roman, serif',
								}}>
								Ilamurugu & Associates
							</h3>
							<p>
								<strong>Phone:</strong> 04448553020
								<br />
								<strong>Alternate number:</strong> 7200190475
								<br />
								<strong>Email:</strong> ilams@ilamsca.com
								<br />
								<strong>Address:</strong> Flat No 23, Sri Iyappa Flats,
								<br />
								New No 5 old 3 Ramachandra road, Mylapore,
								<br />
								Chennai 600004
							</p>
						</div>

						<div className='col-lg-3 col-md-6 footer-links'>
							<h4>Useful Links</h4>
							<ul>
								<li>
									<i className='bx bx-chevron-right'></i>{' '}
									<Link to='/'>Home</Link>
								</li>

								<li>
									<i className='bx bx-chevron-right'></i>{' '}
									<Link to='/services'>Services</Link>
								</li>
								<li>
									<i className='bx bx-chevron-right'></i>
									<Link to='/terms-of-use'>Terms of service</Link>
								</li>
								<li>
									<i className='bx bx-chevron-right'></i>
									<Link to='/privacy-policy'>Privacy policy</Link>
								</li>
							</ul>
						</div>

						<div className='col-lg-3 col-md-6 footer-links'>
							<h4>Our Services</h4>
							<ul>
								<li>
									<i className='bx bx-chevron-right'></i>{' '}
									<Link to='/service/3'>GST</Link>
								</li>
								<li>
									<i className='bx bx-chevron-right'></i>
									<Link to='/service/1'>Accounting</Link>
								</li>
								<li>
									<i className='bx bx-chevron-right'></i>
									<Link to='/service/4'>ITR</Link>
								</li>
								<li>
									<i className='bx bx-chevron-right'></i>{' '}
									<Link to='/service/9'>TDS</Link>
								</li>
								<li>
									<i className='bx bx-chevron-right'></i>
									<Link to='/service/7'>Corporate</Link>
								</li>
							</ul>
						</div>

						<div className='col-lg-3 col-md-6 footer-links'>
							<h4>Our Social Networks</h4>
							<p>Connect with us</p>
							<div className='social-links mt-3'>
								<a href='www.google.com' className='twitter'>
									<i className='bx bxl-twitter'></i>
								</a>
								<a href='www.google.com' className='facebook'>
									<i className='bx bxl-facebook'></i>
								</a>
								<a href='www.google.com' className='instagram'>
									<i className='bx bxl-instagram'></i>
								</a>
								<a href='www.google.com' className='google-plus'>
									<i className='bx bxl-skype'></i>
								</a>
								<a href='www.google.com' className='linkedin'>
									<i className='bx bxl-linkedin'></i>
								</a>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div className='container footer-bottom clearfix'>
				<div className='copyright'>
					&copy; Copyright{' '}
					<strong>
						<span>Ilamurugu & Associates</span>
					</strong>
					. All Rights Reserved
				</div>
				<div className='credits'>
					Designed by{' '}
					<a href='https://bootstrapmade.com/' rel='nofollow'>
						BootstrapMade
					</a>
				</div>
			</div>
		</footer>
	);
};

export const NewsLetter = () => {
	const [email, setEmail] = useState('');
	let subscribeUser = async () => {
		let data = {
			email: email,
			attributes: {
				FNAME: 'ilamuhil',
			},
		};

		let url = 'https://api.sendinblue.com/v3/contacts';
		let options = {
			headers: {
				'Content-type': 'application/json',
				'api-key':
					'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',
				Accept: 'application/json',
			},
		};
		try {
			await fetch(url, {
				method: 'POST',
				headers: options.headers,
				body: JSON.stringify(data),
			}).then();
		} catch (e) {
			console.log(e);
		}
	};
	return (
		<div className='footer-newsletter'>
			<div className='container'>
				<div className='row justify-content-center'>
					<div className='col-lg-6'>
						<h4>Join Our Newsletter</h4>
						<p>Be Updated with Relevant Guidelines</p>
						<form action='' method='post'>
							<input
								type='email'
								name='email'
								onChange={e => setEmail(e.target.value)}
							/>
							<input type='submit' value='Subscribe' onClick={subscribeUser} />
						</form>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Footer;
