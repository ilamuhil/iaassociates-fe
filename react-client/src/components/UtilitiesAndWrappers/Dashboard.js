import * as React from 'react';
import HomeIcon from '@mui/icons-material/Home';
// This component is the layout for Dashboard
import { styled, useTheme } from '@mui/material/styles';
import { Link, Outlet } from 'react-router-dom';
import Box from '@mui/material/Box';
import Popover from '@mui/material/Popover';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import GroupIcon from '@mui/icons-material/Group';
import ViewInArOutlinedIcon from '@mui/icons-material/ViewInArOutlined';
import PersonIcon from '@mui/icons-material/Person';
import BarChartIcon from '@mui/icons-material/BarChart';
import DesignServicesIcon from '@mui/icons-material/DesignServices';
import Avatar from '@mui/material/Avatar';
import LogoutIcon from '@mui/icons-material/Logout';
import AuthContext from '../../context/AuthProvider';
import useMediaQuery from '../../hooks/useWindowResize';
import Alert from '@mui/material/Alert';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AvatarImgf1 from './../../img/avatar/avatarf1.png';
import AvatarImgf2 from './../../img/avatar/avatarf2.png';
import AvatarImgf3 from './../../img/avatar/avatarf3.png';
import AvatarImgf4 from './../../img/avatar/avatarf4.png';
import AvatarImgm1 from './../../img/avatar/avatarm1.png';
import AvatarImgm2 from './../../img/avatar/avatarm2.png';
import AvatarImgm3 from './../../img/avatar/avatarm3.png';
import AvatarImgm4 from './../../img/avatar/avatarm4.png';
import DashboardIcon from './../../img/dashboardicon.png';
import { toast } from 'react-toastify';

const drawerWidth = 200;

const openedMixin = theme => ({
	width: drawerWidth,
	transition: theme.transitions.create('width', {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.enteringScreen,
	}),
	overflowX: 'hidden',
});

const closedMixin = theme => ({
	transition: theme.transitions.create('width', {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.leavingScreen,
	}),
	overflowX: 'hidden',
	width: `calc(${theme.spacing(7)} + 1px)`,
	[theme.breakpoints.up('sm')]: {
		width: `calc(${theme.spacing(8)} + 1px)`,
	},
});

const DrawerHeader = styled('div')(({ theme }) => ({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'flex-end',
	padding: theme.spacing(0, 1),
	// necessary for content to be below app bar
	...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
	shouldForwardProp: prop => prop !== 'open',
})(({ theme, open }) => ({
	zIndex: theme.zIndex.drawer + 1,
	transition: theme.transitions.create(['width', 'margin'], {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.leavingScreen,
	}),
	...(open && {
		marginLeft: drawerWidth,
		width: `calc(100% - ${drawerWidth}px)`,
		transition: theme.transitions.create(['width', 'margin'], {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.enteringScreen,
		}),
	}),
}));

const Drawer = styled(MuiDrawer, {
	shouldForwardProp: prop => prop !== 'open',
})(({ theme, open }) => ({
	width: drawerWidth,
	flexShrink: 0,
	whiteSpace: 'nowrap',
	boxSizing: 'border-box',
	...(open && {
		...openedMixin(theme),
		'& .MuiDrawer-paper': openedMixin(theme),
	}),
	...(!open && {
		...closedMixin(theme),
		'& .MuiDrawer-paper': closedMixin(theme),
	}),
}));

export default function Dashboard({ children }) {
	const tablet = useMediaQuery('md');
	const ctx = React.useContext(AuthContext);
	const theme = useTheme();
	const [open, setOpen] = React.useState(false);
	const [popOverText, setPopOverText] = React.useState('');
	const handleDrawerOpen = () => {
		setOpen(true);
	};
	const [avatar, SetAvatar] = React.useState('');
	const handleDrawerClose = () => {
		setOpen(false);
	};
	const [userIsActive, setUserIsActive] = React.useState(true);
	const [active, setActive] = React.useState('');
	const axiosPvt = ctx.useAxiosPrivate();
	const [anchorEl, setAnchorEl] = React.useState(null);
	const openPopover = Boolean(anchorEl);
	const selectAvatar = React.useCallback(() => {
		switch (avatar) {
			case 'f1':
				setActive(AvatarImgf1);
				break;
			case 'f2':
				setActive(AvatarImgf2);
				break;
			case 'f3':
				setActive(AvatarImgf3);
				break;
			case 'f4':
				setActive(AvatarImgf4);
				break;
			case 'm2':
				setActive(AvatarImgm2);
				break;
			case 'm3':
				setActive(AvatarImgm3);
				break;
			case 'm4':
				setActive(AvatarImgm4);
				break;
			default:
				setActive(AvatarImgm1);
		}
	}, [avatar]);
	const sendEmailVerification = () => {
		toast.promise(axiosPvt.post('/user/confirm-email'), {
			pending: 'sending email please wait..',
			success: 'Email Sent successfully',
			error: 'Could not send email. Try agian later',
		});
	};
	React.useEffect(() => {
		const controller = new AbortController();
		axiosPvt
			.get(
				'user/',
				{ params: { avatar: true, active: true } },
				{ signal: controller.signal }
			)
			.then(res => {
				let { data } = res;
				SetAvatar(data.avatar);
				selectAvatar();
				setUserIsActive(data.active);
			})
			.catch(err => {
				console.error(err);
			});
		return () => {
			controller.abort();
		};
	}, [axiosPvt, selectAvatar]);
	return (
		<Box sx={{ display: 'flex' }}>
			<AppBar position='fixed' open={open}>
				<Toolbar>
					<IconButton
						color='inherit'
						aria-label='open drawer'
						onClick={handleDrawerOpen}
						edge='start'
						sx={{
							marginRight: 5,
							...(open && { display: 'none' }),
						}}>
						<MenuIcon />
					</IconButton>
					<Typography variant='h6' noWrap component='h1'>
						ILAMURUGU &amp; ASSOCIATES
					</Typography>
					<Avatar
						sx={{ width: 35, height: 35, ml: 'auto', mr: 2 }}
						src={active}
					/>
					<Button
						variant='contained'
						size='small'
						color='warning'
						onClick={e => {
							ctx.logout();
						}}
						endIcon={<LogoutIcon />}>
						{tablet && 'Log Out'}
					</Button>
				</Toolbar>
			</AppBar>
			<Drawer variant='permanent' open={open}>
				<DrawerHeader>
					<Box component='div' m='auto'></Box>
					<Box component='img' src={DashboardIcon} width={30}></Box>
					<Typography
						variant='p'
						component='h6'
						sx={{ color: '#1976d2', mr: 'auto' }}>
						DASHBOARD
					</Typography>
					<IconButton onClick={handleDrawerClose}>
						{theme.direction === 'rtl' ? (
							<ChevronRightIcon />
						) : (
							<ChevronLeftIcon />
						)}
					</IconButton>
				</DrawerHeader>
				<Divider />
				<List>
					<Popover
						id='mouse-over-popover'
						sx={{
							pointerEvents: 'none',
							px: '5px',
						}}
						open={!open && openPopover}
						anchorEl={anchorEl}
						onClose={() => {
							setAnchorEl(null);
						}}
						anchorOrigin={{
							vertical: 'center',
							horizontal: 'right',
						}}
						transformOrigin={{
							vertical: 'center',
							horizontal: 'left',
						}}
						disableRestoreFocus>
						<Typography variant='subtitle1' component='p' p='5px'>
							{popOverText}
						</Typography>
					</Popover>
					{ctx.userRole === 33 && (
						<ListItemButton
							onMouseEnter={e => {
								setAnchorEl(e.currentTarget);
								setPopOverText('Analytics');
							}}
							onMouseLeave={() => {
								setAnchorEl(null);
							}}
							divider={true}
							component={Link}
							to='/dashboard/analytics'
							sx={{
								minHeight: 48,
								justifyContent: open ? 'initial' : 'center',
								px: 2.5,
							}}>
							<ListItemIcon
								sx={{
									minWidth: 0,
									mr: open ? 3 : 'auto',
									justifyContent: 'center',
								}}>
								<BarChartIcon sx={{ color: '#1976d2' }} />
							</ListItemIcon>
							<ListItemText
								primary='Analytics'
								sx={{ opacity: open ? 1 : 0, color: '#1976d2' }}
							/>
						</ListItemButton>
					)}
					<ListItemButton
						onMouseEnter={e => {
							setAnchorEl(e.currentTarget);
							setPopOverText('Services');
						}}
						onMouseLeave={() => {
							setAnchorEl(null);
						}}
						divider={true}
						component={Link}
						to='services'
						sx={{
							minHeight: 48,
							justifyContent: open ? 'initial' : 'center',
							px: 2.5,
						}}>
						<ListItemIcon
							sx={{
								minWidth: 0,
								mr: open ? 3 : 'auto',
								justifyContent: 'center',
							}}>
							<DesignServicesIcon sx={{ color: '#1976d2' }} />
						</ListItemIcon>
						<ListItemText
							primary='Services'
							sx={{ opacity: open ? 1 : 0, color: '#1976d2' }}
						/>
					</ListItemButton>
					{ctx.userRole === 33 && (
						<ListItemButton
							onMouseEnter={e => {
								setAnchorEl(e.currentTarget);
								setPopOverText('Users');
							}}
							onMouseLeave={() => {
								setAnchorEl(null);
							}}
							divider={true}
							component={Link}
							to='users'
							sx={{
								minHeight: 48,
								justifyContent: open ? 'initial' : 'center',
								px: 2.5,
							}}>
							<ListItemIcon
								sx={{
									minWidth: 0,
									mr: open ? 3 : 'auto',
									justifyContent: 'center',
								}}>
								<GroupIcon sx={{ color: '#1976d2' }}></GroupIcon>
							</ListItemIcon>
							<ListItemText
								primary='Users'
								sx={{ opacity: open ? 1 : 0, color: '#1976d2' }}
							/>
						</ListItemButton>
					)}

					<ListItemButton
						onMouseEnter={e => {
							setAnchorEl(e.currentTarget);
							setPopOverText('Orders');
						}}
						onMouseLeave={() => {
							setAnchorEl(null);
						}}
						divider={true}
						component={Link}
						to={ctx.userRole === 33 ? 'orders' : 'my-orders'}
						sx={{
							minHeight: 48,
							justifyContent: open ? 'initial' : 'center',
							px: 2.5,
						}}>
						<ListItemIcon
							sx={{
								minWidth: 0,
								mr: open ? 3 : 'auto',
								justifyContent: 'center',
							}}>
							<ViewInArOutlinedIcon
								sx={{ color: '#1976d2' }}></ViewInArOutlinedIcon>
						</ListItemIcon>

						<ListItemText
							primary='Orders'
							sx={{ opacity: open ? 1 : 0, color: '#1976d2' }}
						/>
					</ListItemButton>

					<ListItemButton
						onMouseEnter={e => {
							setAnchorEl(e.currentTarget);
							setPopOverText('Profile');
						}}
						onMouseLeave={() => {
							setAnchorEl(null);
						}}
						component={Link}
						to='/dashboard/profile'
						sx={{
							minHeight: 48,
							justifyContent: open ? 'initial' : 'center',
							px: 2.5,
						}}>
						<ListItemIcon
							sx={{
								minWidth: 0,
								mr: open ? 3 : 'auto',
								justifyContent: 'center',
							}}>
							<PersonIcon sx={{ color: '#1976d2' }} />
						</ListItemIcon>
						<ListItemText
							primary='Profile'
							sx={{ opacity: open ? 1 : 0, color: '#1976d2' }}
						/>
					</ListItemButton>
				</List>
			</Drawer>
			<Box component='main' sx={{ flexGrow: 1, p: 3 }}>
				<DrawerHeader />
				<IconButton
					sx={{
						borderRadius: '50%',
						backgroundColor: '#039be5',
						boxShadow: ' rgba(0, 0, 0, 0.16) 0px 1px 4px;',
						mb: 2,
						'&:hover': {
							backgroundColor: '#039be5',
						},
					}}
					component={Link}
					to={-1}
					onClick={() => {}}>
					<ArrowBackIcon style={{ color: 'white' }} />
				</IconButton>
				<IconButton
					sx={{
						borderRadius: '50%',
						backgroundColor: '#039be5',
						boxShadow: ' rgba(0, 0, 0, 0.16) 0px 1px 4px;',
						mb: 2,
						'&:hover': {
							backgroundColor: '#039be5',
						},
						mx: 2,
					}}
					component={Link}
					to='/'>
					<HomeIcon style={{ color: 'white' }} />
				</IconButton>

				{!userIsActive && (
					<Alert severity='warning' sx={{ mb: 2 }}>
						Your account is inactive{' '}
						<Button
							sx={{ mx: 4 }}
							size='small'
							color='warning'
							variant='outlined'
							onClick={sendEmailVerification}>
							Confirm Email
						</Button>
					</Alert>
				)}

				<Outlet />
			</Box>
		</Box>
	);
}
