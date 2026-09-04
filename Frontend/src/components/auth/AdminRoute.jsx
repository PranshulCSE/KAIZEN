import { Navigate, Outlet } from 'react-router';
import { useAuth } from '../../hooks/useAuth.js';
import { ROUTES } from '../../constants/routes.js';

export default function AdminRoute() {
  const { isAdmin } = useAuth();
  if (!isAdmin) return <Navigate to={ROUTES.DASHBOARD} replace />;
  return <Outlet />;
}
