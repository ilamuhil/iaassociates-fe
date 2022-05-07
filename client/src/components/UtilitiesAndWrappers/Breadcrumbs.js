import React from 'react';
import './../../styles/css/breadcrumbs.css';
import { Link } from 'react-router-dom';
import { Skeleton } from '@mui/material';

const Breadcrumbs = ({ pageName }) => {
	return (
		<section id='breadcrumbs' className='breadcrumbs'>
			<div className='container'>
				<ol>
					<li>
						<Link to='/'>Home</Link>
					</li>
					{Boolean(pageName) ? (
						<li>{pageName}</li>
					) : (
						<Skeleton width={100} sx={{ mx: 2 }} height={20} />
					)}
				</ol>
				{Boolean(pageName) ? (
					<h2>
						{pageName} {Boolean(pageName)}
					</h2>
				) : (
					<Skeleton width={150} height={50} />
				)}
			</div>
		</section>
	);
};

export default Breadcrumbs;
