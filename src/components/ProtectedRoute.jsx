import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

function ProtectedRoute({ children }) {
  const { userId, isInitialized } = useAuth();
  const location = useLocation();

  console.log('ProtectedRoute: userId:', userId, 'isInitialized:', isInitialized, 'Current path:', location.pathname);

  // Ждём инициализации, чтобы избежать раннего редиректа
  if (!isInitialized) {
    return null; // Или загрузочный спиннер, если хочешь
  }

  if (!userId) {
    console.log('Redirecting to /login from:', location.pathname);
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
}

export default ProtectedRoute;