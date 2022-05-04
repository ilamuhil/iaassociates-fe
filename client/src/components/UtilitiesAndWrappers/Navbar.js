import { Component } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/css/navbar.css';
import AuthContext from '../../context/AuthProvider';
import { Offcanvas, Accordion } from 'react-bootstrap';

class Navbar extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loggedIn: false,
			show: false,
		};
	}
	handleClose() {
		this.setState({ show: false });
	}
	handleShow() {
		this.setState({ show: true });
	}

	logout = async () => {
		let authctx = this.context;
		authctx.logout();
	};
	componentDidMount() {
		let authctx = this.context;
		this.setState({ loggedIn: authctx.isLoggedIn });
	}

	render() {
		let { isLoggedIn } = this.context;
		return (
			<header id='header' className='fixed-top'>
				<div className='container d-flex align-items-center'>
					<h1 className='logo me-auto'>
						<Link to='/'>Ilamurugu & Associates</Link>
					</h1>
					{/* <!-- Uncomment below if you prefer to use an image logo -->
          <!-- <Link to="index.html" className="logo me-auto"><img src="assets/img/logo.png" alt="" className="img-fluid"/></Link>--> */}

					<nav id='navbar' className='navbar'>
						<ul>
							<li>
								<Link className='nav-link scrollto active' to='/'>
									Home
								</Link>
							</li>
							<li>
								<a className='nav-link scrollto' href='#about'>
									About
								</a>
							</li>
							<li className='dropdown'>
								<Link to='/services'>
									<span>Services</span> <i className='bi bi-chevron-down'></i>
								</Link>
								<ul>
									<li>
										<Link to='services/1'>Accounting Services</Link>
									</li>
									<li className='dropdown'>
										<Link to='#'>
											<span>Corporate</span>{' '}
											<i className='bi bi-chevron-right'></i>
										</Link>
										<ul>
											<li>
												<Link to='#'>Corporate Finance</Link>
											</li>
											<li>
												<Link to='#'>Corporate Services</Link>
											</li>
											<li>
												<Link to='#'>Corporate Governance</Link>
											</li>
										</ul>
									</li>
									<li>
										<Link to='/services/'>Payroll</Link>
									</li>
									<li>
										<Link to='#'>Benefits of Outsourcing</Link>
									</li>
									<li>
										<Link to='#'>Income Tax</Link>
									</li>
									<li>
										<Link to='#'>Audit</Link>
									</li>
									<li>
										<Link to='#'>GST</Link>
									</li>
									<li>
										<Link to='#'>Services For Non Residents</Link>
									</li>
								</ul>
							</li>
							<li>
								<Link className='nav-link scrollto' to='#team'>
									Team
								</Link>
							</li>

							<li>
								<Link className='nav-link scrollto' to='/contact'>
									Contact
								</Link>
							</li>
							<li className='dropdown'>
								<button className='getstarted text-dark'>
									<img
										src={require('../../img/i-a inspirations.library/images/KZYNB3P0TNY7X.info/Profile Icons - 77,235 free icons.png')}
										alt='profile'
										className='fluid'
										width={'30%'}
									/>
								</button>
								<ul>
									{isLoggedIn && (
										<>
											<li>
												<Link to='/dashboard/profile'>Profile</Link>
											</li>
											<li>
												<Link to='/dashboard/orders'>Orders</Link>
											</li>
											<li>
												<Link to='/' onClick={this.logout}>
													Logout
												</Link>
											</li>
										</>
									)}
									{!isLoggedIn && (
										<>
											<li>
												<Link to='/contact'>Contact</Link>
											</li>
											<li>
												<Link to='/login'>Login</Link>
											</li>
										</>
									)}
								</ul>
							</li>
						</ul>
						<button
							style={{ background: 'transparent', border: 'none' }}
							data-bs-toggle='offcanvas'
							data-bs-target='offCanvasMenu'
							aria-controls='offCanvasMenu'
							onClick={() => this.handleShow()}>
							<i className='bi bi-list mobile-nav-toggle'></i>
						</button>

						<Offcanvas
							placement={'end'}
							show={this.state.show}
							onHide={() => this.handleClose()}
							className='offcanvas-bg'>
							<Offcanvas.Header closeButton>
								<h1>ILAMURUGU &amp; ASSOCIATES</h1>
							</Offcanvas.Header>
							<Offcanvas.Body>
								<Accordion defaultActiveKey='0'>
									<Accordion.Item eventKey='0'>
										<Accordion.Header>
											<Link to='/services'>Services</Link>
										</Accordion.Header>
										<Accordion.Body>
											<ul className='list-group list-group-flush'>
												<li className='list-group-item'>
													<Link to='services/1'>Accounting Services</Link>
												</li>
												<li className='dropdown list-group-item'>
													<Link to='#'>
														<span>Corporate</span>{' '}
													</Link>
												</li>
											</ul>
										</Accordion.Body>
									</Accordion.Item>
									<Accordion.Item eventKey='1'>
										<Link to='/contact'>
											<Accordion.Header>Contact</Accordion.Header>
										</Link>
										<Accordion.Body>
											<p className='border-bottom border-1 pb-2'>
												<a href='mailto:ilams@ilamsca.com'>
													Email us @ : support@ilamsca.com
												</a>
											</p>
											<p className='border-bottom border-1 pb-2'>
												<Link to='/contact'>Give us a call @ 8967837783</Link>
											</p>
											<p>
												<Link to='/contact'>
													Or drop a message <u>here</u>
												</Link>
											</p>
										</Accordion.Body>
									</Accordion.Item>
									<Accordion.Item eventKey='2'>
										<Accordion.Header>
											<Link to='/about'>About us</Link>
										</Accordion.Header>
									</Accordion.Item>
									<Accordion.Item eventKey='3'>
										<Accordion.Header>
											{isLoggedIn && (
												<Link to='/' onClick={this.logout}>
													Logout
												</Link>
											)}
											{!isLoggedIn && <Link to='/login'>Login</Link>}
										</Accordion.Header>
									</Accordion.Item>
								</Accordion>
							</Offcanvas.Body>
						</Offcanvas>
					</nav>
				</div>
			</header>
		);
	}
}
Navbar.contextType = AuthContext;
// const MenuItem = ({ value, link, dropdownItems, subDropdownItems }) => {
//   const [subMenuValue, setSubMenuValue] = useState("");
//   const [subMenuLink, setSubMenuLink] = useState("");
//   let isSubdropDownItem = (value, items) => {
//     let match = items.filter((item) => item.matchValue === value);
//     if (match.length !== 0) {
//       setSubMenuValue(match[0].value);
//       setSubMenuLink(match[0].link);
//       return true;
//     }
//     return false;
//   };

//   return dropdownItems.length === 0 ? (
//     <li>
//       <Link className="nav-link scrollto active" to={link}>
//         {value}
//       </Link>
//     </li>
//   ) : (
//     dropdownItems.map((dropdownItem) => (
//       <li className="dropdown">
//         <Link to={dropdownItem.link}>
//           <span>{dropdownItem.value}</span>{" "}
//           <i className="bi bi-chevron-down"></i>
//         </Link>
//         {subDropdownItems &&
//         isSubdropDownItem(dropdownItem.value, subDropdownItems) ? (
//           <ul>
//             <li>
//               <Link to={subMenuLink}>{subMenuValue}</Link>
//             </li>
//           </ul>
//         ) : null}
//       </li>
//     ))
//   );
// };

export default Navbar;
