import { RouteObject } from 'react-router-dom';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AssetManagerDashboardPage from './pages/AssetManagerDashboardPage';
import DepartmentHeadDashboardPage from './pages/DepartmentHeadDashboardPage';
import EmployeeDashboardPage from './pages/EmployeeDashboardPage';

// TODO: Wrap routes with ProtectedRoute / role-based access as needed
const DashboardRoutes: RouteObject[] = [
  { path: 'admin-dashboard', element: <AdminDashboardPage /> },
  { path: 'asset-manager-dashboard', element: <AssetManagerDashboardPage /> },
  { path: 'department-head-dashboard', element: <DepartmentHeadDashboardPage /> },
  { path: 'employee-dashboard', element: <EmployeeDashboardPage /> },
];

export default DashboardRoutes;
