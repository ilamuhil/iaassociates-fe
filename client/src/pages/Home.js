import { Button } from '@mui/material';
import { useState } from 'react';
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogContentText,
	TextField,
	DialogActions,
} from '@mui/material';

import { Link } from 'react-router-dom';
import { Layout } from './../components/UtilitiesAndWrappers/Layout';
import axios from '../api/axios';
import React from 'react';

const Home = () => {
	const [open, setOpen] = useState(false);
	const [phoneNumber, setPhoneNumber] = useState(0);
	const [email, setEmail] = useState('');
	const [message, setMessage] = useState('');
	const handleClose = () => {
		setOpen(false);
		axios.post('/sendMessage', { email, phoneNumber, message });
	};
	return (
		<Layout>
			<section id='hero' className='d-flex align-items-center'>
				<div className='container'>
					<div className='row'>
						<div className='col-lg-6 d-flex flex-column justify-content-center pt-4 pt-lg-0 order-2 order-lg-1'>
							<h1>Incorporate your Business today !</h1>
							<h2>
								Let us take care of your compliances,
								<br />
								so that you can concentrate on what you love.
							</h2>
							<div className='d-flex justify-content-center justify-content-lg-start'>
								<Button
									onClick={() => {
										setOpen(true);
									}}
									className='btn-get-started scrollto'>
									Get Started
								</Button>
							</div>
						</div>
						<div className='col-lg-6 order-1 order-lg-2 hero-img'>
							<img
								src={require('./../img/hero-img.png')}
								className='img-fluid animated'
								alt=''
							/>
						</div>
					</div>
				</div>
			</section>
			{/* <!-- End Hero --> */}

			<main id='main'>
				{/* <!-- ======= About Us Section ======= -->  */}
				<section id='about' className='about'>
					<div className='container'>
						<div className='section-title'>
							<h2>About Us</h2>
						</div>

						<div className='row content'>
							<div className='col-lg-6'>
								<p>
									Ilamurugu & Associates is a professionally managed firm. The
									team consists of distinguished chartered accountants,
									corporate financial advisors and tax consultants. The firm
									represents a combination of specialized skills, which are
									geared to offers sound financial advice and personalized
									proactive services. Those associated with the firm have
									regular interaction.
								</p>
							</div>
							<div className='col-lg-6 pt-4 pt-lg-0'>
								<p>
									Ilamurugu & Associates established in the year 2009. A
									chartered accountancy firm rendering comprehensive
									professional services which include audit, management
									consultancy, tax consultancy, accounting services, manpower
									management, secretarial services etc.
								</p>
							</div>
						</div>
					</div>
				</section>
				{/* <!-- End About Us Section -->

 <!-- ======= Why Us Section ======= --> */}
				<section id='why-us' className='why-us section-bg'>
					<div className='container-fluid'>
						<div className='row'>
							<div className='col-lg-7 d-flex flex-column justify-content-center align-items-stretch order-2 order-lg-1'>
								<div className='content'>
									<h3>Where We Specialize</h3>
									<p>
										Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
										do eiusmod tempor incididunt ut labore et dolore magna
										aliqua. Duis aute irure dolor in reprehenderit
									</p>
								</div>

								<div className='accordion-list'>
									<ul>
										<li>
											<a
												data-bs-toggle='collapse'
												className='collapse'
												data-bs-target='#accordion-list-1'
												href='https://google.com'>
												<span>01</span> GST Services
												<i className='bx bx-chevron-down icon-show'></i>
												<i className='bx bx-chevron-up icon-close'></i>
											</a>
											<div
												id='accordion-list-1'
												className='collapse show'
												data-bs-parent='.accordion-list'>
												<p>
													GST Migrations and Registrations. Filing of GST
													Returns. GST Consultancy/ Advisory on various issues
													of GST..
												</p>
											</div>
										</li>

										<li>
											<a
												data-bs-toggle='collapse'
												data-bs-target='#accordion-list-2'
												className='collapsed'
												href='https://google.com'>
												<span>02</span> Accounting
												<i className='bx bx-chevron-down icon-show'></i>
												<i className='bx bx-chevron-up icon-close'></i>
											</a>
											<div
												id='accordion-list-2'
												className='collapse'
												data-bs-parent='.accordion-list'>
												<p>
													Businesses increasingly find it difficult to keep up
													to the myriad and abstruse...
												</p>
											</div>
										</li>

										<li>
											<a
												data-bs-toggle='collapse'
												data-bs-target='#accordion-list-3'
												className='collapsed'
												href='https://google.com'>
												<span>03</span> Audit Services
												<i className='bx bx-chevron-down icon-show'></i>
												<i className='bx bx-chevron-up icon-close'></i>
											</a>
											<div
												id='accordion-list-3'
												className='collapse'
												data-bs-parent='.accordion-list'>
												<p>
													Indepth study of existing systems, procedures and
													controls for proper understanding. Suggestions..
												</p>
											</div>
										</li>
									</ul>
								</div>
							</div>
							{/*eslint-disable-next-line no-undef*/}
							<div
								className='col-lg-5 align-items-stretch order-1 order-lg-2 img'
								style={{
									backgroundImage: 'url("./../img/why-us.png")',
								}}>
								&nbsp;
							</div>
						</div>
					</div>
				</section>
				{/* <!-- End Why Us Section -->

 <!-- ======= Skills Section ======= --> */}
				<section id='skills' className='skills'>
					<div className='container'>
						<div className='row'>
							<div className='col-lg-6 d-flex align-items-center'>
								<img
									src={require('./../img/skills.png')}
									className='img-fluid'
									alt=''
								/>
							</div>
							<div className='col-lg-6 pt-4 pt-lg-0 content'>
								<h3>
									Voluptatem dignissimos provident quasi corporis voluptates
								</h3>
								<p className='fst-italic'>
									Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
									do eiusmod tempor incididunt ut labore et dolore magna aliqua.
								</p>

								<div className='skills-content'>
									<div className='progress'>
										<span className='skill'>
											HTML <i className='val'>100%</i>
										</span>
										<div className='progress-bar-wrap'>
											<div
												className='progress-bar'
												role='progressbar'
												aria-valuenow='100'
												aria-valuemin='0'
												aria-valuemax='100'></div>
										</div>
									</div>

									<div className='progress'>
										<span className='skill'>
											CSS <i className='val'>90%</i>
										</span>
										<div className='progress-bar-wrap'>
											<div
												className='progress-bar'
												role='progressbar'
												aria-valuenow='90'
												aria-valuemin='0'
												aria-valuemax='100'></div>
										</div>
									</div>

									<div className='progress'>
										<span className='skill'>
											JavaScript <i className='val'>75%</i>
										</span>
										<div className='progress-bar-wrap'>
											<div
												className='progress-bar'
												role='progressbar'
												aria-valuenow='75'
												aria-valuemin='0'
												aria-valuemax='100'></div>
										</div>
									</div>

									<div className='progress'>
										<span className='skill'>
											Photoshop <i className='val'>55%</i>
										</span>
										<div className='progress-bar-wrap'>
											<div
												className='progress-bar'
												role='progressbar'
												aria-valuenow='55'
												aria-valuemin='0'
												aria-valuemax='100'></div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>
				{/* <!-- End Skills Section -->

 <!-- ======= Services Section ======= --> */}
				<section id='services' className='services section-bg'>
					<div className='container'>
						<div className='section-title'>
							<h2>Services</h2>
							<p>
								We at <b>Ilamurugu & Associates</b> focus on helping clients
								design and build Tomorrow’s organisation. <br />
								We provide real world solutions to complex business issues
								through audit and assurance functions, <br />{' '}
								taxation-international and domestic, startup in India, company
								formation in India and foreign investment in India etc.
							</p>
						</div>

						<div className='row'>
							<div className='col-xl-3 col-md-6 d-flex align-items-stretch'>
								<div className='icon-box'>
									<div className='icon'>
										<i className='bx bxl-dribbble'></i>
									</div>
									<h4>
										<a href='https://google.com'>Corporate compliance</a>
									</h4>
									<p className='mb-3'>
										Indian companies are governed by Companies Act 1956 and
										company has to comply with various statutory provisions as
										per different sections of Companies Act 1956.
									</p>
									<a href='www.google.com' className='btn-learn-more mt-2'>
										Read more
									</a>
								</div>
							</div>

							<div className='col-xl-3 col-md-6 d-flex align-items-stretch mt-4 mt-md-0'>
								<div className='icon-box'>
									<div className='icon'>
										<i className='bx bx-file'></i>
									</div>
									<h4>
										<Link to=''>Accounts Outsourcing</Link>
									</h4>
									<p className='mb-3'>
										A refinance allows you to take out new personal loans that
										pay off your current mortgage. Although you are then
										obligated to make payments on the new ...
									</p>
									<Link to='/' className='btn-learn-more  mt-2'>
										Read more
									</Link>
								</div>
							</div>

							<div className='col-xl-3 col-md-6 d-flex align-items-stretch mt-4 mt-xl-0'>
								<div className='icon-box'>
									<div className='icon'>
										<i className='bx bx-tachometer'></i>
									</div>
									<h4>
										<Link to='/'>Business Planning </Link>
									</h4>
									<p className='mb-3'>
										Business can be setup in India in three types like Formation
										of liaison office , Formation of Project office and
										Formation of Branch office
									</p>
									<Link to='/' className='btn-learn-more  mt-2'>
										Read more
									</Link>
								</div>
							</div>

							<div className='col-xl-3 col-md-6 d-flex align-items-stretch mt-4 mt-xl-0'>
								<div className='icon-box'>
									<div className='icon'>
										<i className='bx bx-layer'></i>
									</div>
									<h4>
										<Link to='/'>Service Tax Audit</Link>
									</h4>
									<p className='mb-3'>
										Internal Audit is an independent appraisal function
										established within an organization to examine and evaluate
										its activities as a service to the organization.
									</p>
									<Link to='/' className='btn-learn-more mt-2'>
										Read more
									</Link>
								</div>
							</div>
						</div>
					</div>
				</section>

				<section id='cta' className='cta'>
					<div className='container'>
						<div className='row'>
							<div className='col-lg-9 text-center text-lg-start'>
								<h3 className='mb-3'>Get your consultation today!</h3>
								<p>
									Our firm of chartered accountants represents a coalition of
									specialized skills that is geared to offer sound financial
									solutions and advices. The organization is a congregation of
									professionally qualified and experienced persons who are
									committed to add value and optimize the benefits accruing to
									clients.
								</p>
							</div>
							<div className='col-lg-3 cta-btn-container text-center'>
								<Button
									onClick={() => {
										setOpen(true);
									}}
									className='cta-btn align-middle'>
									Request a callback
								</Button>
								<Dialog open={open}>
									<DialogTitle>Message</DialogTitle>
									<DialogContent>
										<DialogContentText>
											Briefly mention your requirements as we will get back to
											you as soon as possible
										</DialogContentText>
										<TextField
											autoFocus
											margin='dense'
											id='name'
											label='Email Address'
											type='email'
											fullWidth
											onChange={e => {
												setEmail(e.target.value);
											}}
											variant='standard'
										/>
										<TextField
											autoFocus
											margin='dense'
											id='name'
											label='Phone Number'
											type='phone Number'
											fullWidth
											onChange={e => {
												setPhoneNumber(e.target.value);
											}}
											variant='standard'
										/>
										<TextField
											id='standard-textarea'
											label='Your Requirements'
											margin='dense'
											onChange={e => {
												setMessage(e.target.value);
											}}
											placeholder='Placeholder'
											multiline
											fullWidth
											variant='standard'
										/>
									</DialogContent>
									<DialogActions>
										<Button
											onClick={() => {
												setOpen(false);
											}}
											color='error'>
											Cancel
										</Button>
										<Button onClick={handleClose} color='success'>
											Send
										</Button>
									</DialogActions>
								</Dialog>
							</div>
						</div>
					</div>
				</section>
				{/* <!-- End Cta Section -->

<!-- ======= Team Section ======= --> */}
				<section id='team' className='team section-bg'>
					<div className='container'>
						<div className='section-title'>
							<h2>Our Team</h2>
							<p>
								Our firm continuously strives to be the Premier Accounting and
								Consultancy firm that provides excellent service to our clients
								and an excellent quality of life for our associates.
							</p>
						</div>

						<div className='row'>
							<div className='col-lg-6'>
								<div className='member d-flex align-items-start'>
									<div className='pic'>
										<img
											src={require('./../img/team/team-1.jpg')}
											className='img-fluid'
											alt=''
										/>
									</div>
									<div className='member-info'>
										<h4>Ilamurugu</h4>
										<span>Chief Executive Officer</span>
										<p>
											Explicabo voluptatem mollitia et repellat qui dolorum
											quasi
										</p>
										<div className='social'>
											<a href='google.com'>
												<i className='ri-twitter-fill'></i>
											</a>
											<a href='google.com'>
												<i className='ri-facebook-fill'></i>
											</a>
											<a href='google.com'>
												<i className='ri-instagram-fill'></i>
											</a>
											<a href='google.com'>
												{' '}
												<i className='ri-linkedin-box-fill'></i>{' '}
											</a>
										</div>
									</div>
								</div>
							</div>

							<div className='col-lg-6 mt-4 mt-lg-0'>
								<div className='member d-flex align-items-start'>
									<div className='pic'>
										<img
											src={require('./../img/team/team-2.jpg')}
											className='img-fluid'
											alt='Team Member'
										/>
									</div>
									<div className='member-info'>
										<h4>Srimathy</h4>
										<span>Product Manager</span>
										<p>
											Aut maiores voluptates amet et quis praesentium qui senda
											para
											<Link to='/checkout'>CheckOut</Link>
										</p>
										<div className='social'>
											<a href='https://google.com'>
												<i className='ri-twitter-fill'></i>
											</a>
											<a href='https://google.com'>
												<i className='ri-facebook-fill'></i>
											</a>
											<a href='https://google.com'>
												<i className='ri-instagram-fill'></i>
											</a>
											<a href='https://google.com'>
												{' '}
												<i className='ri-linkedin-box-fill'></i>{' '}
											</a>
										</div>
									</div>
								</div>
							</div>

							<div className='col-lg-6 mt-4'>
								<div className='member d-flex align-items-start'>
									<div className='pic'>
										<img
											src={require('./../img/team/team-3.jpg')}
											className='img-fluid'
											alt=''
										/>
									</div>
									<div className='member-info'>
										<h4>Another Team Member</h4>
										<span>CTO</span>
										<p>
											Quisquam facilis cum velit laborum corrupti fuga rerum
											quia
										</p>
										<div className='social'>
											<a href='https://google.com'>
												<i className='ri-twitter-fill'></i>
											</a>
											<a href='https://google.com'>
												<i className='ri-facebook-fill'></i>
											</a>
											<a href='https://google.com'>
												<i className='ri-instagram-fill'></i>
											</a>
											<a href='https://google.com'>
												{' '}
												<i className='ri-linkedin-box-fill'></i>{' '}
											</a>
										</div>
									</div>
								</div>
							</div>

							<div className='col-lg-6 mt-4'>
								<div className='member d-flex align-items-start'>
									<div className='pic'>
										<img
											src={require('./../img/team/team-4.jpg')}
											className='img-fluid'
											alt=''
										/>
									</div>
									<div className='member-info'>
										<h4>Another Team Member</h4>
										<span>Accountant</span>
										<p>
											Dolorum tempora officiis odit laborum officiis et et
											accusamus
										</p>
										<div className='social'>
											<a href='https://google.com'>
												<i className='ri-twitter-fill'></i>
											</a>
											<a href='https://google.com'>
												<i className='ri-facebook-fill'></i>
											</a>
											<a href='https://google.com'>
												<i className='ri-instagram-fill'></i>
											</a>
											<a href='https://google.com'>
												{' '}
												<i className='ri-linkedin-box-fill'></i>{' '}
											</a>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>
				{/* <!-- End Team Section -->



<!-- ======= Frequently Asked Questions Section ======= --> */}
				<section id='faq' className='faq section-bg'>
					<div className='container'>
						<div className='section-title'>
							<h2>Frequently Asked Questions</h2>
							<p>
								Magnam dolores commodi suscipit. Necessitatibus eius consequatur
								ex aliquid fuga eum quidem. Sit sint consectetur velit. Quisquam
								quos quisquam cupiditate. Et nemo qui impedit suscipit alias ea.
								Quia fugiat sit in iste officiis commodi quidem hic quas.
							</p>
						</div>

						<div className='faq-list'>
							<ul>
								<li>
									<i className='bx bx-help-circle icon-help'></i>
									<a
										href='https://google.com'
										data-bs-toggle='collapse'
										className='collapse'
										data-bs-target='#faq-list-1'>
										Non consectetur a erat nam at lectus urna duis?
										<i className='bx bx-chevron-down icon-show'></i>
										<i className='bx bx-chevron-up icon-close'></i>
									</a>
									<div
										id='faq-list-1'
										className='collapse show'
										data-bs-parent='.faq-list'>
										<p>
											Feugiat pretium nibh ipsum consequat. Tempus iaculis urna
											id volutpat lacus laoreet non curabitur gravida. Venenatis
											lectus magna fringilla urna porttitor rhoncus dolor purus
											non.
										</p>
									</div>
								</li>

								<li>
									<i className='bx bx-help-circle icon-help'></i>
									<a
										href='https://google.com'
										data-bs-toggle='collapse'
										data-bs-target='#faq-list-2'
										className='collapsed'>
										Feugiat scelerisque varius morbi enim nunc?
										<i className='bx bx-chevron-down icon-show'></i>
										<i className='bx bx-chevron-up icon-close'></i>
									</a>
									<div
										id='faq-list-2'
										className='collapse'
										data-bs-parent='.faq-list'>
										<p>
											Dolor sit amet consectetur adipiscing elit pellentesque
											habitant morbi. Id interdum velit laoreet id donec
											ultrices. Fringilla phasellus faucibus scelerisque
											eleifend donec pretium. Est pellentesque elit ullamcorper
											dignissim. Mauris ultrices eros in cursus turpis massa
											tincidunt dui.
										</p>
									</div>
								</li>

								<li>
									<i className='bx bx-help-circle icon-help'></i>
									<a
										href='https://google.com'
										data-bs-toggle='collapse'
										data-bs-target='#faq-list-3'
										className='collapsed'>
										Dolor sit amet consectetur adipiscing elit?
										<i className='bx bx-chevron-down icon-show'></i>
										<i className='bx bx-chevron-up icon-close'></i>
									</a>
									<div
										id='faq-list-3'
										className='collapse'
										data-bs-parent='.faq-list'>
										<p>
											Eleifend mi in nulla posuere sollicitudin aliquam ultrices
											sagittis orci. Faucibus pulvinar elementum integer enim.
											Sem nulla pharetra diam sit amet nisl suscipit. Rutrum
											tellus pellentesque eu tincidunt. Lectus urna duis
											convallis convallis tellus. Urna molestie at elementum eu
											facilisis sed odio morbi quis
										</p>
									</div>
								</li>

								<li>
									<i className='bx bx-help-circle icon-help'></i>
									<a
										href='https://google.com'
										data-bs-toggle='collapse'
										data-bs-target='#faq-list-4'
										className='collapsed'>
										Tempus quam pellentesque nec nam aliquam sem et tortor
										consequat? <i className='bx bx-chevron-down icon-show'></i>
										<i className='bx bx-chevron-up icon-close'></i>
									</a>
									<div
										id='faq-list-4'
										className='collapse'
										data-bs-parent='.faq-list'>
										<p>
											Molestie a iaculis at erat pellentesque adipiscing
											commodo. Dignissim suspendisse in est ante in. Nunc vel
											risus commodo viverra maecenas accumsan. Sit amet nisl
											suscipit adipiscing bibendum est. Purus gravida quis
											blandit turpis cursus in.
										</p>
									</div>
								</li>

								<li>
									<i className='bx bx-help-circle icon-help'></i>
									<a
										href='https://google.com'
										data-bs-toggle='collapse'
										data-bs-target='#faq-list-5'
										className='collapsed'>
										Tortor vitae purus faucibus ornare. Varius vel pharetra vel
										turpis nunc eget lorem dolor?
										<i className='bx bx-chevron-down icon-show'></i>
										<i className='bx bx-chevron-up icon-close'></i>
									</a>
									<div
										id='faq-list-5'
										className='collapse'
										data-bs-parent='.faq-list'>
										<p>
											Laoreet sit amet cursus sit amet dictum sit amet justo.
											Mauris vitae ultricies leo integer malesuada nunc vel.
											Tincidunt eget nullam non nisi est sit amet. Turpis nunc
											eget lorem dolor sed. Ut venenatis tellus in metus
											vulputate eu scelerisque.
										</p>
									</div>
								</li>
							</ul>
						</div>
					</div>
				</section>
				{/*  End FAQ */}
			</main>
		</Layout>
	);
};

export default Home;
