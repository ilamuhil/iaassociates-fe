import { Button } from '@mui/material';
import './../../styles/css/unauthorized.css';
import { Link } from 'react-router-dom';

const Unauthorized = () => {
	return (
		<div className='wrapper'>
			<div className='container1'>
				<h1 className='unauthorizedheading'>
					Sorry folks, this page is forbidden.
				</h1>
				<p>The moose out front shoulda told ya!</p>
				<Button component={Link} to={-1} variant='contained' color='error'>
					Go Back
				</Button>
			</div>
		</div>
	);
};

export default Unauthorized;
