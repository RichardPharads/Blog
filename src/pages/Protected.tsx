// pages/Protected.tsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/AuthHook';

const Protected = () => {
  const { authorized, loading } = useAuth();
  
  // Show loading indicator while checking auth
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!authorized) {
    return <Navigate to="/login" replace />;
  }
  
  return <Outlet />;
};

export default Protected;