import { RouteObject } from 'react-router-dom';
import NotificationsPage from './pages/NotificationsPage';

// TODO: Wrap routes with ProtectedRoute / role-based access as needed
const NotificationsRoutes: RouteObject[] = [
  { path: 'notifications', element: <NotificationsPage /> },
];

export default NotificationsRoutes;
