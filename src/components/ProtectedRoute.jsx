import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

function ProtectedRoute({ children }) {
  const { userId } = useAuth();
  const location = useLocation();

  console.log('ProtectedRoute: userId:', userId, 'Current path:', location.pathname);

  if (!userId) {
    console.log('Redirecting to /login from:', location.pathname);
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
}

export default ProtectedRoute;