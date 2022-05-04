import React from 'react';
import './../../styles/css/breadcrumbs.css';
import { Link } from 'react-router-dom';



const Breadcrumbs = ({ pageName }) => {
	return (
		<section id='breadcrumbs' className='breadcrumbs'>
			<div className='container'>
				<ol>
					<li>
						<Link to='/'>Home</Link>
					</li>
					<li>{pageName}</li>
				</ol>
				<h2>{pageName}</h2>
			</div>
		</section>
	);
};

export default Breadcrumbs;
