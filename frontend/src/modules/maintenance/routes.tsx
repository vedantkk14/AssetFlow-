import { RouteObject } from 'react-router-dom';
import MaintenanceListPage from './pages/MaintenanceListPage';
import MaintenanceRequestPage from './pages/MaintenanceRequestPage';

// TODO: Wrap routes with ProtectedRoute / role-based access as needed
const MaintenanceRoutes: RouteObject[] = [
  { path: 'maintenance-list', element: <MaintenanceListPage /> },
  { path: 'maintenance-request', element: <MaintenanceRequestPage /> },
];

export default MaintenanceRoutes;
