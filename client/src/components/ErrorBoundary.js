import { Paper, Typography,Grid } from '@mui/material';
import React, { Component } from 'react';

export class ErrorBoundary extends Component {
	constructor(props) {
		super(props);
		this.state = {
			error: null,
			errorInfo: null,
		};
	}

	componentDidCatch(error, errorInfo) {
		this.setState({ error: error, errorInfo: errorInfo });
        console.log(errorInfo);
	}
	render() {
		if (this.state.error) {
			return (
				<Grid item lg={6} mx="auto" >
					<Paper
                        sx={{
                            padding:4,
							marginTop: '10px',
							borderRadius: '10px',
							minHeight: '200px',
						}}>
						<Typography variant='h5' mb="10px" textAlign='center'>
							Something Went Wrong!
						</Typography>
						<Typography variant='body1' color='red' textAlign='center'>
							{this.state.error.toString()} StackTrace :
							{this.state.errorInfo.componentStack}
						</Typography>
					</Paper>
				</Grid>
			);
		}
		return this.props.children;
	}
}

export default ErrorBoundary;
