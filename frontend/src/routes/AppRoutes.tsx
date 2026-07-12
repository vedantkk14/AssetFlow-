import { Navigate, Route, Routes } from 'react-router-dom';
import AuthLayout from '@/components/layout/AuthLayout';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ProtectedRoute from '@/components/shared/ProtectedRoute';
import PublicRoute from '@/components/shared/PublicRoute';
import Loader from '@/components/shared/Loader';
import { useAuth } from '@/hooks/useAuth';
import { ROLES, ROLE_DASHBOARD_PATH } from '@/types/role.types';
import AuthRoutes from '@/modules/auth/routes';
import OrganizationRoutes from '@/modules/organization/routes';
import AllocationRoutes from '@/modules/allocation/routes';
import AdminDashboardPage from '@/modules/dashboard/pages/AdminDashboardPage';
import AssetManagerDashboardPage from '@/modules/dashboard/pages/AssetManagerDashboardPage';
import DepartmentHeadDashboardPage from '@/modules/dashboard/pages/DepartmentHeadDashboardPage';
import EmployeeDashboardPage from '@/modules/dashboard/pages/EmployeeDashboardPage';

const RootRedirect = () => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <Loader fullScreen />;
  }

  if (isAuthenticated && user) {
    return <Navigate to={ROLE_DASHBOARD_PATH[user.role]} replace />;
  }

  return <Navigate to="/login" replace />;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />

      <Route element={<PublicRoute />}>
        <Route element={<AuthLayout />}>
          {AuthRoutes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
        </Route>
      </Route>

      <Route element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]} />}>
        <Route element={<DashboardLayout />}>
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute allowedRoles={[ROLES.ASSET_MANAGER]} />}>
        <Route element={<DashboardLayout />}>
          <Route path="/asset-manager/dashboard" element={<AssetManagerDashboardPage />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute allowedRoles={[ROLES.DEPARTMENT_HEAD]} />}>
        <Route element={<DashboardLayout />}>
          <Route path="/department/dashboard" element={<DepartmentHeadDashboardPage />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute allowedRoles={[ROLES.EMPLOYEE]} />}>
        <Route element={<DashboardLayout />}>
          <Route path="/employee/dashboard" element={<EmployeeDashboardPage />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]} />}>
        <Route path="/organization" element={<DashboardLayout />}>
          {OrganizationRoutes.map((route) =>
            'index' in route && route.index ? (
              <Route key="index" index element={route.element} />
            ) : (
              <Route key={route.path} path={route.path} element={route.element} />
            )
          )}
        </Route>
      </Route>

      <Route
        element={<ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.ASSET_MANAGER, ROLES.DEPARTMENT_HEAD, ROLES.EMPLOYEE]} />}
      >
        <Route path="/allocation" element={<DashboardLayout />}>
          {AllocationRoutes.map((route) =>
            'index' in route && route.index ? (
              <Route key="index" index element={route.element} />
            ) : (
              <Route key={route.path} path={route.path} element={route.element} />
            )
          )}
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
