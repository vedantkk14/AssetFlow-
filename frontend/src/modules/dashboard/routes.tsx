import { RouteObject } from 'react-router-dom';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AssetManagerDashboardPage from './pages/AssetManagerDashboardPage';
import DepartmentHeadDashboardPage from './pages/DepartmentHeadDashboardPage';
import EmployeeDashboardPage from './pages/EmployeeDashboardPage';

// Each dashboard route needs a different role guard, so AppRoutes.tsx wires
// these pages directly (one ProtectedRoute per role) rather than importing
// this array. Kept here for reference/consistency with other modules.
const DashboardRoutes: RouteObject[] = [
  { path: '/admin/dashboard', element: <AdminDashboardPage /> },
  { path: '/asset-manager/dashboard', element: <AssetManagerDashboardPage /> },
  { path: '/department/dashboard', element: <DepartmentHeadDashboardPage /> },
  { path: '/employee/dashboard', element: <EmployeeDashboardPage /> },
];

export default DashboardRoutes;
