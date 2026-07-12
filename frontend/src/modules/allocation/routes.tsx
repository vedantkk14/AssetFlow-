import { RouteObject } from 'react-router-dom';
import AllocationDashboardPage from './pages/AllocationDashboardPage';
import AllocateAssetPage from './pages/AllocateAssetPage';
import TransferRequestsPage from './pages/TransferRequestsPage';
import ReturnRequestsPage from './pages/ReturnRequestsPage';
import AllocationHistoryPage from './pages/AllocationHistoryPage';
import MyAllocationsPage from './pages/MyAllocationsPage';

const AllocationRoutes: RouteObject[] = [
  { index: true, element: <AllocationDashboardPage /> },
  { path: 'allocate', element: <AllocateAssetPage /> },
  { path: 'transfers', element: <TransferRequestsPage /> },
  { path: 'returns', element: <ReturnRequestsPage /> },
  { path: 'history', element: <AllocationHistoryPage /> },
  { path: 'my-allocations', element: <MyAllocationsPage /> },
];

export default AllocationRoutes;
