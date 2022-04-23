import { useCallback, useContext, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import AuthContext from '../context/AuthProvider';
import { toast } from 'react-toastify';
import { Checkbox, Button, FormControlLabel, FormGroup } from '@mui/material';

function MarketingSetting() {
	const ctx = useContext(AuthContext);
	const axiosPvt = ctx.useAxiosPrivate();
	const [serviceOffers, setServiceOffers] = useState(true);
	const [complianceInfo, setComplianceInfo] = useState(true);
	const { id: urlpath } = useParams();
	useEffect(() => {
		const controller = new AbortController();
		axiosPvt
			.get('/user', {
				params: {
					marketingPreference: true,
				},
				signal: controller.signal,
			})
			.then(
				({
					data: {
						marketingPreference: { ServiceOffers: so, complianceInfo: ci },
					},
				}) => {
					setServiceOffers(so);
					setComplianceInfo(ci);
				}
			)
			.catch(e => {
				console.warn('could not retrieve marketing data');
			});
		return () => {
			controller.abort();
		};
	}, [axiosPvt]);
	const updateMarketingSetting = useCallback(() => {
		toast.promise(
			axiosPvt.post(`/user/marketing/${urlpath ? urlpath : ''}`, {
				serviceOffers,
				complianceInfo,
			}),
			{
				pending: 'Updating your settings preference',
				success: 'Successfully updated preference ✓',
				error: 'Could not update your preference. Try again later',
			}
		);
	}, [axiosPvt, complianceInfo, serviceOffers, urlpath]);
	return (
		<div className='col-12 col-sm-5 mb-3'>
			<div className='row mb-4'>
				<div className='col'>
					<div className='custom-controls-stacked pr-2'>
						<FormGroup>
							<div className='mb-2'>
								<b>Email Notification Settings</b>
							</div>
							<FormControlLabel
								control={
									<Checkbox
										size='small'
										checked={complianceInfo}
										onChange={() => {
											setComplianceInfo(p => !p);
										}}
									/>
								}
								label='Compliance Info and Deadlines'
							/>
							<FormControlLabel
								control={
									<Checkbox
										size='small'
										checked={serviceOffers}
										onChange={() => {
											setServiceOffers(p => !p);
										}}
									/>
								}
								label='Occassional Service Discounts and Offers'
							/>
							<FormControlLabel
								control={<Checkbox size='small' checked={true} />}
								label='My Service Updates'
							/>
						</FormGroup>
					</div>
				</div>
			</div>
			<div className='row'>
				<div className='col'>
					<Button
						variant='contained'
						size='small'
						color='warning'
						onClick={updateMarketingSetting}>
						Update Email Settings
					</Button>
				</div>
			</div>
		</div>
	);
}
export default MarketingSetting;
