// import data from './data/db.json';
import { Layout } from '../components/Layout';
import { Link } from 'react-router-dom';
import './../styles/css/service.css';
import { Fragment } from 'react';
import BreadCrumbs from '../components/Breadcrumbs';

const Services = props => {
	const services = [
		{
			servicetitle: 'Gst Services',
			serviceId: 1,
			serviceFeature: [
				'GST Migrations and Registrations',
				'Filing of GST Returns',
				'GST Consultancy/Advisory on various issues of GST',
				'Impact Analysis on Business Segments',
			],
			serviceIconLink: 'gst.png',
		},
		{
			servicetitle: 'Accounting Services',
			serviceId: 2,
			serviceFeature: [
				'Financial Reporting',
				'Budgeting',
				'Asset Accounting Management',
				'MIS Reports',
			],
			serviceIconLink: 'accounting.png',
		},
		{
			servicetitle: 'Payroll Services',
			serviceId: 3,
			serviceFeature: [
				'Preparation of Monthly Salary Sheet',
				'Deductions as per applicable laws like Income Tax and Provident Fund',
				'Disbursement/ Online Payment of Salary',
				'Pay slip by password protected e-mail',
				'Reimbursement of telephone, medical bills etc',
			],
			serviceIconLink: 'government.png',
		},
		{
			servicetitle: 'Incorporation Services',
			serviceId: 4,
			serviceFeature: [
				'GST Migrations and Registrations',
				'Filing of GST Returns',
				'GST Consultancy/Advisory on various issues of GST',
				'Impact Analysis on Business Segments',
				'Impact Analysis on Business Segments',
			],
			serviceIconLink: 'company.png',
		},
		{
			servicetitle: 'Incorporation Services',
			serviceId: 4,
			serviceFeature: [
				'GST Migrations and Registrations',
				'Filing of GST Returns',
				'GST Consultancy/Advisory on various issues of GST',
				'Impact Analysis on Business Segments',
				'Impact Analysis on Business Segments',
			],
			serviceIconLink: 'company.png',
		},
		{
			servicetitle: 'ITR Services',
			serviceId: 4,
			serviceFeature: [
				'GST Migrations and Registrations',
				'Filing of GST Returns',
				'GST Consultancy/Advisory on various issues of GST',
				'Impact Analysis on Business Segments',
				'Impact Analysis on Business Segments',
			],
			serviceIconLink: 'itr-for-professionals.png',
		},
	];

	return (
		<Layout>
			<BreadCrumbs pageName='Services' />
			<div className='container'>
				<div class='header'>
					<h1 className='text-center my-4'>Our Services</h1>
					<div className='border-bottom'></div>
				</div>

				<div className='row mb-4 justify-content-center'>
					{services.map((service, key) => {
						return (
							<div className='col-lg-4 col-xxl-3 col-md-6 col-sm-9' key={key}>
								<ServiceCard
									servicefeatureOverview={service.serviceFeature}
									serviceTitle={service.servicetitle}
									serviceId={service.serviceId}>
									<img
										src={require(`./../img/${service.serviceIconLink}`)}
										alt='gst service icon'
										className='service-icon'
									/>
								</ServiceCard>
							</div>
						);
					})}
				</div>
			</div>

			{/* <div>{servicedata && servicedata.content}</div> */}
		</Layout>
	);
};
const ServiceCard = props => {
	return (
		<div className='servicecard mx-auto rounded-2'>
			<div className='d-flex flex-column'>
				{props.children}
				<h4 className='my-3'>{props.serviceTitle}</h4>
			</div>
			<ul className='d-flex flex-column'>
				{props.servicefeatureOverview.map((servicefeature, index) =>
					index <= 3 ? (
						<li key={index} className='d-flex justify-content-between'>
							<Link to='/'>{servicefeature}</Link>
						</li>
					) : (
						<Fragment key={index}></Fragment>
					)
				)}
				<li>
					<Link to={`services/${props.serviceId}`}>Read more</Link>
					<span>
						<img src={require('./../img/arrow.png')} width={'15px'} alt='' />
					</span>
				</li>
			</ul>
		</div>
	);
};

export default Services;
