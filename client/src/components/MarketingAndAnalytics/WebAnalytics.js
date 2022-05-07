import { Stack, Card } from '@mui/material';

const WebAnalytics = () => {
	return (
		<Stack direction='column' justifyContent='center' spacing={2} mx='auto'>
			<Card
				sx={{
					borderRadius: '15px',
					pt: '7rem',
					height: '300px',
					maxWidth: '300px',
					mx: 'auto',
					textAlign: 'center',
					backgroundColor: ' #7ee8fa',
					backgroundImage: 'linear-gradient(315deg, #7ee8fa 0%, #80ff72 74%)',
				}}>
				<h3 style={{ color: 'white' }}>
					<i>Analytics for a future release...</i>
				</h3>
			</Card>
		</Stack>
	);
};

export default WebAnalytics;
