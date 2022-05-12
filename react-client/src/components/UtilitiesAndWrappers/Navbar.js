import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/css/navbar.css';
import useServices from '../../hooks/useServices';
import useWindowResize from '../../hooks/useWindowResize';
import AuthContext from '../../context/AuthProvider';
import HomeIcon from '@mui/icons-material/Home';
import ListIcon from '@mui/icons-material/List';
import SettingsIcon from '@mui/icons-material/Settings';
import PhoneIcon from '@mui/icons-material/Phone';
import GavelIcon from '@mui/icons-material/Gavel';
import PolicyIcon from '@mui/icons-material/Policy';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import LoginIcon from '@mui/icons-material/Login';
import {
	ListItem,
	Box,
	ListItemIcon,
	ListItemText,
	List,
	SwipeableDrawer,
	IconButton,
	Divider,
} from '@mui/material';

const Navbar = () => {
	const ctx = useContext(AuthContext);
	const { isLoggedIn, userRole } = ctx;
	const services = useServices();
	const [openDrawer, setOpenDrawer] = useState(false);
	const logout = () => {
		ctx.logout();
	};
	const lg = useWindowResize('lg');
	const toggleDrawer = open => event => {
		if (
			event &&
			event.type === 'keydown' &&
			(event.key === 'Tab' || event.key === 'Shift')
		) {
			return;
		}

		setOpenDrawer(open);
	};
	return (
		<header id='header' className='fixed-top'>
			<SideDrawer
				openDrawer={openDrawer}
				toggleDrawer={toggleDrawer}
				logout={logout}
				isLoggedIn={isLoggedIn}
				role={userRole}
			/>
			<div className='container d-flex align-items-center'>
				<h1 className='logo me-auto'>
					<Link
						to='/'
						style={{
							fontFamily:
								'Baskerville, Baskerville Old Face, Garamond, Times New Roman, serif',
						}}>
						Ilamurugu &amp; Associates
					</Link>
				</h1>

				<nav id='navbar' className='navbar'>
					<ul>
						<li>
							<Link className='nav-link scrollto active' to='/'>
								Home
							</Link>
						</li>

						<li className='dropdown'>
							<Link to='/services'>
								<span>Services</span> <i className='bi bi-chevron-down'></i>
							</Link>
							<ul>
								{services &&
									services.map(service => (
										<li key={`${service.id}`} className='text-capitalize'>
											<Link to={`/service/${service.id}`}>{service.title}</Link>
										</li>
									))}
							</ul>
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
											<Link
												to={
													userRole === 33
														? `/dashboard/orders`
														: `/dashboard/my-orders`
												}>
												Orders
											</Link>
										</li>
										<li>
											<Link to='/' onClick={logout}>
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
					{!lg && (
						<IconButton
							onClick={toggleDrawer(true)}
							style={{ background: 'transparent', border: 'none' }}>
							<ListIcon sx={{ color: 'white' }} fontSize='large' />
						</IconButton>
					)}
				</nav>
			</div>
		</header>
	);
};

const SideDrawer = ({ openDrawer, toggleDrawer, isLoggedIn, role, logout }) => {
	return (
		<div>
			<SwipeableDrawer
				sx={{ backgroundColor: '#38507f' }}
				anchor='top'
				open={openDrawer}
				onClose={toggleDrawer(false)}
				onOpen={toggleDrawer(true)}>
				<Box
					sx={{ width: 'auto' }}
					role='presentation'
					onClick={toggleDrawer(false)}
					onKeyDown={toggleDrawer(false)}>
					<List
						sx={{
							'&.MuiList-root': {
								backgroundColor: '#38507f',
							},
						}}>
						<ListItem button component={Link} to='/'>
							<ListItemIcon>
								<HomeIcon sx={{ color: 'white' }} />
							</ListItemIcon>
							<ListItemText primary='Home' sx={{ color: 'white' }} />
						</ListItem>
						{isLoggedIn && (
							<>
								<Divider />
								<ListItem button component={Link} to='/dashboard/profile'>
									<ListItemIcon>
										<PersonIcon sx={{ color: 'white' }} />
									</ListItemIcon>
									<ListItemText primary='Profile' sx={{ color: 'white' }} />
								</ListItem>
								<Divider />
								<ListItem
									button
									component={Link}
									to={
										role === 33 ? '/dashboard/orders' : '/dashboard/my-orders'
									}>
									<ListItemIcon>
										<ShoppingBagIcon sx={{ color: 'white' }} />
									</ListItemIcon>
									<ListItemText primary='Orders' sx={{ color: 'white' }} />
								</ListItem>
							</>
						)}

						<Divider />
						<ListItem button component={Link} to='/services'>
							<ListItemIcon>
								<SettingsIcon sx={{ color: 'white' }} />
							</ListItemIcon>
							<ListItemText primary='Services' sx={{ color: 'white' }} />
						</ListItem>
						<Divider />
						<ListItem button component={Link} to='/contact'>
							<ListItemIcon>
								<PhoneIcon sx={{ color: 'white' }} />
							</ListItemIcon>
							<ListItemText primary='Contact' sx={{ color: 'white' }} />
						</ListItem>
						<Divider />
						<ListItem button component={Link} to='/terms-of-use'>
							<ListItemIcon>
								<GavelIcon sx={{ color: 'white' }} />
							</ListItemIcon>
							<ListItemText primary='Terms of use' sx={{ color: 'white' }} />
						</ListItem>
						<Divider />
						<ListItem button component={Link} to='/privacy-policy'>
							<ListItemIcon>
								<PolicyIcon sx={{ color: 'white' }} />
							</ListItemIcon>
							<ListItemText primary='Privacy Policy' sx={{ color: 'white' }} />
						</ListItem>
						{!isLoggedIn ? (
							<>
								<Divider />
								<ListItem button component={Link} to='/login'>
									<ListItemIcon>
										<LoginIcon sx={{ color: 'white' }} />
									</ListItemIcon>
									<ListItemText primary='Login' sx={{ color: 'white' }} />
								</ListItem>
							</>
						) : (
							<>
								<Divider />
								<ListItem
									button
									onClick={() => {
										logout();
									}}>
									<ListItemIcon>
										<LogoutIcon sx={{ color: 'white' }} />
									</ListItemIcon>
									<ListItemText primary='Logout' sx={{ color: 'white' }} />
								</ListItem>
							</>
						)}
					</List>
				</Box>
			</SwipeableDrawer>
		</div>
	);
};

export default Navbar;
