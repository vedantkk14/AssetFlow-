import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.middleware';
import { authorize } from '../../middlewares/rbac.middleware';
import { Role } from '@prisma/client';
import { uploadSingleImage, handleImageUpload } from '../../middlewares/upload.middleware';
import {
  createAsset,
  updateAsset,
  updateAssetStatus,
  deleteAsset,
  getAssetById,
  getAllAssets,
  getAssetsByCategory,
  getAssetsByDepartment
} from './assets.controller';

const router = Router();

// Protect all routes
router.use(authenticate);

// Public searches / retrievals (All roles: ADMIN, ASSET_MANAGER, DEPARTMENT_HEAD, EMPLOYEE)
router.get('/', getAllAssets);
router.get('/search', getAllAssets);
router.get('/categories/:categoryId', getAssetsByCategory);
router.get('/departments/:departmentId', getAssetsByDepartment);
router.get('/:id', getAssetById);

// Write permissions (restricted to ADMIN and ASSET_MANAGER)
router.post(
  '/',
  authorize(Role.ADMIN, Role.ASSET_MANAGER),
  uploadSingleImage,
  handleImageUpload,
  createAsset
);

router.put(
  '/:id',
  authorize(Role.ADMIN, Role.ASSET_MANAGER),
  uploadSingleImage,
  handleImageUpload,
  updateAsset
);

router.patch(
  '/:id/status',
  authorize(Role.ADMIN, Role.ASSET_MANAGER),
  updateAssetStatus
);

router.delete(
  '/:id',
  authorize(Role.ADMIN, Role.ASSET_MANAGER),
  deleteAsset
);

export default router;
