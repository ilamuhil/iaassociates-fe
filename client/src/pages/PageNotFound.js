import React from 'react';
import { Layout } from './../components/Layout';
import { Link } from 'react-router-dom';
import BreadCrumbs from '../components/Breadcrumbs';

const PageNotFound = () => {
	return (
		<Layout>
			<BreadCrumbs pageName='404 Page Not Found' />
			<div className='row container-lg flex-wrap-reverse my-4 mx-auto'>
				<div className='col-lg-6 d-flex flex-column justify-content-center my-4 my-lg-0'>
					<h1 className='text-center text-danger my-4 my-lg-0'>
						Error Page Not Found!!!
					</h1>
					<p className='text-center fs-6 mt-lg-4' style={{ color: '#334069' }}>
						<i>Oops looks like the page you are looking for does not exist</i>
					</p>
					<Link
						to='/'
						style={{
							textDecoration: 'none',
							border: '2px solid #4DB4E2',
							padding: '0.4em 2em',
							backgroundColor: '#46b2e4',
							fontWeight: '300',
							color: 'white',
							boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px',
						}}
						className='text-center d-flex flex-row rounded-1 align-baseline my-4 mx-auto'>
						<span className='fw-bolder'>Back to Home</span>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							className='h-6 w-6'
							fill='none'
							width='20px'
							viewBox='0 0 24 24'
							style={{ marginLeft: '15px' }}
							stroke='currentColor'>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth='2'
								d='M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6'
							/>
						</svg>
					</Link>
				</div>
				<div className='col-lg-6 my-4 my-lg-0'>
					<img
						src={require('./../img/13.png')}
						alt='page not found error illustration'
						className='img-fluid'
					/>
				</div>
			</div>
		</Layout>
	);
};

export default PageNotFound;
