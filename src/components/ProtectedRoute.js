// frontend/src/components/ProtectedRoute.js
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth();

  // Show loading while checking authentication
  if (loading) {
    return <div style={{ padding: '50px', textAlign: 'center' }}>Loading...</div>;
  }

  // Not logged in - redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check if role is required and user doesn't have it
  if (role && user.role !== role) {
    return <Navigate to="/home" replace />;
  }

  // User is authenticated and has required role - show the page
  return children;
}

export default ProtectedRoute;