import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { ROLE_DASHBOARD_PATH } from '@/types/role.types';
import Loader from './Loader';

const PublicRoute = () => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <Loader fullScreen />;
  }

  if (isAuthenticated && user) {
    return <Navigate to={ROLE_DASHBOARD_PATH[user.role]} replace />;
  }

  return <Outlet />;
};

export default PublicRoute;
