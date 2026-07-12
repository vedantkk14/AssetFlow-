import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.middleware';
import { authorize } from '../../middlewares/rbac.middleware';
import { Role } from '@prisma/client';
import {
  getAdminDashboard,
  getAssetManagerDashboard,
  getDepartmentDashboard,
  getEmployeeDashboard
} from './dashboard.controller';

const router = Router();

// Protect all dashboard routes
router.use(authenticate);

router.get('/admin', authorize(Role.ADMIN), getAdminDashboard);
router.get('/asset-manager', authorize(Role.ASSET_MANAGER), getAssetManagerDashboard);
router.get('/department', authorize(Role.DEPARTMENT_HEAD), getDepartmentDashboard);
router.get('/employee', authorize(Role.EMPLOYEE), getEmployeeDashboard);

export default router;

