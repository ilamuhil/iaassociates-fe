import React from 'react';
import {
	FormLabel,
	RadioGroup,
	FormControl,
	Radio,
	FormControlLabel,
	Grid,
} from '@mui/material';
import { Outlet, useNavigate } from 'react-router-dom';
function OrderActionsWrapper() {
	let navigate = useNavigate();
	return (
		<Grid container spacing={2} justifyContent='start'>
			<Grid item xs={12}>
				<FormControl>
					<FormLabel id='order-actions' style={{ color: 'black' }}>
						<b>ORDER ACTIONS</b>
					</FormLabel>
					<RadioGroup
						row
						aria-labelledby='order-actions'
						name='order-actions'
						defaultValue='edit-order'
						onChange={e => {
							navigate(e.target.value);
						}}>
						<FormControlLabel
							value='new-order'
							control={<Radio />}
							label='New Order'
						/>
						<FormControlLabel
							value='edit-order'
							control={<Radio />}
							label='Edit Order'
						/>
						<FormControlLabel
							value='refund-order'
							control={<Radio />}
							label='Refund Order'
						/>
						<FormControlLabel
							value='send-payment-link'
							control={<Radio />}
							label='Send Payment Link'
						/>
					</RadioGroup>
				</FormControl>
			</Grid>
			<Outlet />
		</Grid>
	);
}

export default OrderActionsWrapper;
