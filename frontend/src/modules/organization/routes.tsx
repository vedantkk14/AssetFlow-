import { RouteObject } from 'react-router-dom';
import OrganizationHomePage from './pages/OrganizationHomePage';
import DepartmentManagementPage from './pages/DepartmentManagementPage';
import CategoryManagementPage from './pages/CategoryManagementPage';
import EmployeeDirectoryPage from './pages/EmployeeDirectoryPage';

const OrganizationRoutes: RouteObject[] = [
  { index: true, element: <OrganizationHomePage /> },
  { path: 'departments', element: <DepartmentManagementPage /> },
  { path: 'categories', element: <CategoryManagementPage /> },
  { path: 'employees', element: <EmployeeDirectoryPage /> },
];

export default OrganizationRoutes;
