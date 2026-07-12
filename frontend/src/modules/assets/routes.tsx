import { RouteObject } from 'react-router-dom';
import AssetsListPage from './pages/AssetsListPage';
import AssetDetailsPage from './pages/AssetDetailsPage';
import AddAssetPage from './pages/AddAssetPage';

// TODO: Wrap routes with ProtectedRoute / role-based access as needed
const AssetsRoutes: RouteObject[] = [
  { path: 'assets-list', element: <AssetsListPage /> },
  { path: 'asset-details', element: <AssetDetailsPage /> },
  { path: 'add-asset', element: <AddAssetPage /> },
];

export default AssetsRoutes;
