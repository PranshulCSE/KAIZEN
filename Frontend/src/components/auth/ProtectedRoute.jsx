import { Navigate, Outlet } from 'react-router';
import { useAuth } from '../../hooks/useAuth.js';
import { ROUTES } from '../../constants/routes.js';
import { PageLoader } from '../ui/Spinner.jsx';
import AppShell from '../layout/AppShell.jsx';

export default function ProtectedRoute() {
  const { isAuthenticated, isBootstrapping } = useAuth();

  if (isBootstrapping) return <PageLoader label="Checking session" />;
  if (!isAuthenticated) return <Navigate to={ROUTES.LOGIN} replace />;

  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
}
