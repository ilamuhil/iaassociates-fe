// import { useContext, useEffect } from 'react';
// import Unauthorized from '../components/Authorization/Unauthorized';
// import AuthContext from '../context/AuthProvider';
function ProtectedRoute({ children, allowedRoles }) {
	// const ctx = useContext(AuthContext);
	// useEffect(() => {}, [ctx.isLoggedIn, ctx.userRole]);
	// if (ctx.isLoggedIn) {
	// 	return allowedRoles.find(role => role === ctx.userRole) ? (
	// 		children
	// 	) : (
	// 		<Unauthorized />
	// 	);
	// } else {
	// 	window.location.href = '/login';
	// }
	console.log(allowedRoles);
	return children;
}

export default ProtectedRoute;
