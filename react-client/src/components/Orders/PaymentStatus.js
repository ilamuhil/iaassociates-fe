import { Button } from '@mui/material';
import './../../styles/css/paymentStatus.css';
import { Link, useParams } from 'react-router-dom';
const PaymentStatus = () => {
	let { verification, orderId } = useParams();
	let error = verification === 'success' ? false : true;
	const title = error ? 'Transaction Failed' : 'Success';
	const message = error
		? [
				'Oops there has been some problem',
				'If money has been debited from your account  it will be refunded automatically',
				'✗',
		  ]
		: [
				`We received your payment for order #${orderId}. An email confirmation has been sent to your registered email address`,
				"we'll be in touch with you shortly!",
				'✓',
		  ];
	return (
		<>
			<div className='customcard col-lg-4'>
				<div className='wrapper-circle'>
					<i
						className={
							error
								? 'checkmark-error error-color'
								: 'checkmark-success success-color'
						}>
						{message[2]}
					</i>
				</div>
				<h1 className={!error ? 'title success-color' : 'title error-color'}>
					{title}
				</h1>
				<p className='paymentMessage'>
					{message[0]}
					<br />
					{message[1]}
				</p>
				<div style={{ alignSelf: 'center' }}>
					<Button
						variant='contained'
						color={!error ? 'success' : 'error'}
						size='small'
						component={Link}
						to='/dashboard/my-orders'>
						View Order Notes
					</Button>
				</div>
			</div>
		</>
	);
};

export default PaymentStatus;
