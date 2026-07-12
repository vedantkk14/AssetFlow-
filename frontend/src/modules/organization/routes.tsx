import { RouteObject } from 'react-router-dom';
import DepartmentsPage from './pages/DepartmentsPage';
import EmployeesPage from './pages/EmployeesPage';
import RolesPage from './pages/RolesPage';

// TODO: Wrap routes with ProtectedRoute / role-based access as needed
const OrganizationRoutes: RouteObject[] = [
  { path: 'departments', element: <DepartmentsPage /> },
  { path: 'employees', element: <EmployeesPage /> },
  { path: 'roles', element: <RolesPage /> },
];

export default OrganizationRoutes;
