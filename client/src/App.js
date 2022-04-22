import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import useWindowResize from './hooks/useWindowResize';
import Contact from './pages/Contact';
import Home from './pages/Home';
import { lazy } from 'react';
import Services from './pages/Services';
import LoginForm from './pages/LoginForm';
import PageNotFound from './pages/PageNotFound';
import Checkout from './pages/Checkout';
import ErrorBoundary from './components/ErrorBoundary';
import Privacypolicy from './pages/Privacypolicy';
import {
	PasswordVerify,
	PasswordResetEmail,
	EmailVerify,
} from './components/EmailVerify';
import ProtectedRoute from './api/ProtectedRoute';
import { ToastContainer, Zoom } from 'react-toastify';
import { Suspense } from 'react';
import UserOrder from './components/UserOrder';
import DbLayout from './components/DbLayout';
import Invoice from './components/Invoice';
import AddService from './components/AddService';
import Service from './pages/Service';
import Terms from './pages/Terms';
// const DbLayout = lazy(() => import('./components/DbLayout'));
const UsersList = lazy(() => import('./components/UsersList'));
const Orders = lazy(() => import('./components/Orders'));
const WebAnalytics = lazy(() => import('./components/WebAnalytics'));
const Profile = lazy(() => import('./components/Profile'));

function App() {
	const size = useWindowResize();
	return (
		<ErrorBoundary>
			<Router>
				<Routes>
					{/* Routes starting with "/*" are absolute routes relative Routes do not start with /  */}
					<Route path='/' element={<Home />} />
					<Route path='/service' element={<Service />} />
					<Route path='/terms-of-use' element={<Terms />} />
					<Route path='/services' element={<Services />} />
					<Route path='/login' element={<LoginForm />} />
					<Route path='/contact' element={<Contact />} />
					<Route path='*' element={<PageNotFound />} />
					<Route path='/privacy-policy' element={<Privacypolicy />} />

					<Route path='/dashboard' element={<DbLayout />}>
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
						<Route
							element={
								<>
									<ProtectedRoute allowedRoles={[105]}>
										<Suspense fallback={<div>Loading...</div>}>
											{/* <UserOrder /> */}
											<AddService edit />
										</Suspense>
									</ProtectedRoute>
								</>
							}
							path='services/:id'
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
							path='invoice:/id'
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

						<Route
							path='orders'
							element={
								<ProtectedRoute allowedRoles={[33]}>
									<Suspense fallback={<div>Loading...</div>}>
										<Orders />
									</Suspense>
								</ProtectedRoute>
							}
						/>
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
