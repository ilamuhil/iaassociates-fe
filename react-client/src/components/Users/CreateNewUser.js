import { TextField, MenuItem, Select, Button, Stack } from '@mui/material';
import { useState } from 'react';
import { toast } from 'react-toastify';
import axios from '../../api/axios';
import AddIcon from '@mui/icons-material/Add';
import Card from '@mui/material/Card';
function CreateNewUser() {
	const [role, setRole] = useState('user');
	const [username, setUsername] = useState('');
	const [email, setEmail] = useState('');
	const submitForm = () => {
		toast.promise(
			axios.post('/authenticate/register', {
				userRegister: { username, email, role },
			}),
			{
				pending: 'Creating user...',
				success: 'User created',
				error: 'User could not be created',
			}
		);
	};
	return (
		<Card sx={{ maxWidth: '300px', p: 4, borderRadius: '15px' }}>
			<Stack direction='column' justifyContent='center' spacing={2} mx='auto'>
				<h3>Create New User</h3>
				<div>
					<TextField
						fullWidth
						variant='standard'
						size='small'
						label='Username'
						onChange={e => {
							setUsername(e.target.value);
						}}
					/>
				</div>
				<div>
					<TextField
						fullWidth
						size='small'
						variant='standard'
						label='Email'
						onChange={e => {
							setEmail(e.target.value);
						}}
					/>
				</div>
				<div>
					<Select
						value={role}
						variant='filled'
						defaultValue='user'
						size='small'
						onChange={e => {
							setRole(e.target.value);
						}}
						label='Role'>
						<MenuItem value={'admin'}>Admin</MenuItem>
						<MenuItem value={'user'}>User</MenuItem>
					</Select>
				</div>
				<div>
					<Button
						variant='contained'
						onClick={submitForm}
						size='small'
						startIcon={<AddIcon />}
						color='info'>
						Create User
					</Button>
				</div>
			</Stack>
		</Card>
	);
}

export default CreateNewUser;
