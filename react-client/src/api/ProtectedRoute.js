import { useContext } from 'react';
import AuthContext from '../context/AuthProvider';
import { Navigate,useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
function ProtectedRoute({ children, allowedRoles }) {
	const navigate = useNavigate();
	const ctx = useContext(AuthContext);
	console.log(allowedRoles);
	if (Boolean(Cookies.get('isLoggedIn'))) {
		return allowedRoles.find(role => role === ctx.userRole) ? (
			children
		) : (
			<Navigate to='/unauthorized' replace={true} />
		);
	} else {
		navigate('/login');
	}
	return children;
}

export default ProtectedRoute;
