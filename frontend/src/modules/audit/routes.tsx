import { RouteObject } from 'react-router-dom';
import AuditLogsPage from './pages/AuditLogsPage';

// TODO: Wrap routes with ProtectedRoute / role-based access as needed
const AuditRoutes: RouteObject[] = [
  { path: 'audit-logs', element: <AuditLogsPage /> },
];

export default AuditRoutes;
