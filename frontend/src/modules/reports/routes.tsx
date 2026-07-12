import { RouteObject } from 'react-router-dom';
import ReportsPage from './pages/ReportsPage';

// TODO: Wrap routes with ProtectedRoute / role-based access as needed
const ReportsRoutes: RouteObject[] = [
  { path: 'reports', element: <ReportsPage /> },
];

export default ReportsRoutes;
