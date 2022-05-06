import { Button } from '@mui/material';
import styles from './../../styles/css/unauthorized.module.css';
import { Link } from 'react-router-dom';

const Unauthorized = () => {
	return (
		<div className={styles.wrapper}>
			<div className={styles.container1}>
				<h1 className={styles.unauthorizedheading}>
					Sorry folks, this page is forbidden.
				</h1>
				<p>The moose out front shoulda told ya!</p>
				<Button component={Link} to={-2} variant='contained' color='error'>
					Go Back
				</Button>
			</div>
		</div>
	);
};

export default Unauthorized;
