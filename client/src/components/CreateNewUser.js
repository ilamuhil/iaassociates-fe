import { TextField, MenuItem, Select,Button } from '@mui/material';
import { useState } from 'react';
import { toast } from 'react-toastify';
import axios from '../api/axios';


function CreateNewUser() {
	const [role, setRole] = useState('');
	const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const submitForm = () => {
        toast.promise(axios.post("/authenticate/register", { userRegister: { username, email} }));
    }
	return (
		<div className='row'>
			<div className='col'>
				<TextField
					variant='standard'
					size='small'
					label='Username'
					onChange={e => {
						setUsername(e.target.value);
					}}
				/>
			</div>
			<div className='col'>
				<TextField
					size='small'
					variant='standard'
					label='Email'
					onChange={e => {
						setEmail(e.target.value);
					}}
				/>
			</div>
			<div className='col'>
				<Select
					value={role}
					size='small'
					variant='filled'
					onChange={e => {
						setRole(e.target.value);
					}}
					label='Age'>
					<MenuItem value={'admin'}>Ten</MenuItem>
					<MenuItem value={'user'}>Twenty</MenuItem>
				</Select>
			</div>
			<div className='col'>
				<Button variant="contained" onClick={submitForm}>Create User</Button>
			</div>
		</div>
	);
}

export default CreateNewUser;
