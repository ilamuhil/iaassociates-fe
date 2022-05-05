import { lazy } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import useWindowResize from './hooks/useWindowResize';
import Contact from './pages/Contact';
import Home from './pages/Home';
import Services from './pages/Services';
import LoginForm from './pages/LoginForm';
import PageNotFound from './pages/PageNotFound';
import Checkout from './pages/Checkout';
import Privacypolicy from './pages/Privacypolicy';
import ErrorBoundary from './components/Authorization/ErrorBoundary';
import PaymentStatus from './components/Orders/PaymentStatus';
import ProtectedRoute from './api/ProtectedRoute';
import { ToastContainer, Zoom } from 'react-toastify';
import { Suspense } from 'react';
import SendPaymentLink from './components/Orders/SendPaymentLink';
import UserOrder from './components/Orders/UserOrder';
import Dashboard from './components/UtilitiesAndWrappers/Dashboard';
import Invoice from './components/Orders/Invoice';
import AddEditService from './components/Services/AddEditService';
import Service from './pages/Service';
import Terms from './pages/Terms';
import EditOrder from './components/Orders/EditOrder';
import NewOrder from './components/Orders/NewOrder';
import RefundOrder from './components/Orders/RefundOrder';
import {
	PasswordVerify,
	PasswordResetEmail,
	EmailVerify,
} from './components/UtilitiesAndWrappers/EmailVerify';
import CreateNewUser from './components/Users/CreateNewUser';
import ServiceList from './components/Services/ServiceList';

const UsersList = lazy(() => import('./components/Users/UsersList'));
const Orders = lazy(() => import('./components/Orders/Orders'));
const WebAnalytics = lazy(() =>
	import('./components/MarketingAndAnalytics/WebAnalytics')
);
const Profile = lazy(() => import('./components/Users/Profile'));

function App() {
	const size = useWindowResize();
	return (
		<ErrorBoundary>
			<Router>
				<Routes>
					{/* Routes starting with "/*" are absolute routes relative Routes do not start with /  */}
					<Route path='/' element={<Home />} />
					<Route path='/service/:id' element={<Service />} />
					<Route path='/terms-of-use' element={<Terms />} />
					<Route path='/services' element={<Services />} />
					<Route path='/login' element={<LoginForm />} />
					<Route path='/contact' element={<Contact />} />
					<Route path='*' element={<PageNotFound />} />
					<Route path='/privacy-policy' element={<Privacypolicy />} />

					<Route path='/dashboard' element={<Dashboard />}>
						<Route
							path='payment/:verification/:orderId'
							element={<PaymentStatus />}
						/>
						<Route
							path='profile'
							element={
								<>
									<ProtectedRoute allowedRoles={[33, 105, 91]}>
										<Suspense fallback={<div>Loading...</div>}>
											<Profile />
										</Suspense>
									</ProtectedRoute>
								</>
							}
						/>
						<Route path='services' element={<ServiceList />} />
						<Route
							element={
								<>
									<ProtectedRoute allowedRoles={[105]}>
										<Suspense fallback={<div>Loading...</div>}>
											<AddEditService edit />
										</Suspense>
									</ProtectedRoute>
								</>
							}
							path='services/:id'
						/>
						<Route
							element={
								<>
									<ProtectedRoute allowedRoles={[105]}>
										<Suspense fallback={<div>Loading...</div>}>
											<AddEditService  />
										</Suspense>
									</ProtectedRoute>
								</>
							}
							path='add-service'
						/>
						<Route
							path='analytics'
							element={
								<>
									<ProtectedRoute allowedRoles={[33]}>
										<Suspense fallback={<div>Loading...</div>}>
											<WebAnalytics />
										</Suspense>
									</ProtectedRoute>
								</>
							}
						/>

						<Route
							path='my-orders'
							element={
								<>
									<ProtectedRoute allowedRoles={[105]}>
										<Suspense fallback={<div>Loading...</div>}>
											<UserOrder />
										</Suspense>
									</ProtectedRoute>
								</>
							}
						/>
						<Route
							path='invoice/:orderId'
							element={
								<ProtectedRoute allowedRoles={[33, 105]}>
									<Suspense fallback={<div>Loading...</div>}>
										<Invoice />
									</Suspense>
								</ProtectedRoute>
							}
						/>
						<Route
							path='user/:id'
							element={
								<ProtectedRoute allowedRoles={[33]}>
									<Suspense fallback={<div>Loading...</div>}>
										<Profile />
									</Suspense>
								</ProtectedRoute>
							}
						/>
						<Route
							path='users'
							element={
								<>
									<ProtectedRoute allowedRoles={[33]}>
										<Suspense fallback={<div>Loading...</div>}>
											<UsersList />
										</Suspense>
									</ProtectedRoute>
								</>
							}
						/>
						<Route path='users/newUser' element={<CreateNewUser />} />

						<Route
							path='orders'
							element={
								<ProtectedRoute allowedRoles={[33]}>
									<Suspense fallback={<div>Loading...</div>}>
										<Orders />
									</Suspense>
								</ProtectedRoute>
							}>
							<Route path='new-order' element={<NewOrder />} />
							<Route path='edit-order' element={<EditOrder />} />
							<Route path='refund-order' element={<RefundOrder />} />
							<Route path='send-payment-link' element={<SendPaymentLink />} />
						</Route>
						<Route path='admin/invoice/:orderId' element={<Invoice />} />
					</Route>

					<Route
						path='/verifyemail/:verificationId'
						element={<EmailVerify />}
					/>
					<Route
						path='/update-password/:verificationId'
						element={<PasswordVerify />}
					/>
					<Route
						path='/reset-password-email'
						element={<PasswordResetEmail />}
					/>
					<Route path='/checkout' element={<Checkout />} />
				</Routes>
			</Router>
			<ToastContainer
				position='top-center'
				autoClose={3000}
				hideProgressBar={true}
				pauseOnHover
				theme='colored'
				transition={Zoom}
				limit={1}
				style={{
					width: size <= 500 ? '100%' : '70%',
					maxWidth: '500px',
				}}
			/>
		</ErrorBoundary>
	);
}

export default App;
