import { RouteObject } from 'react-router-dom';
import AllocationsListPage from './pages/AllocationsListPage';
import AllocateAssetPage from './pages/AllocateAssetPage';

// TODO: Wrap routes with ProtectedRoute / role-based access as needed
const AllocationRoutes: RouteObject[] = [
  { path: 'allocations-list', element: <AllocationsListPage /> },
  { path: 'allocate-asset', element: <AllocateAssetPage /> },
];

export default AllocationRoutes;
