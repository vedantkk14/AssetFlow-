import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.middleware';
import { authorize } from '../../middlewares/rbac.middleware';
import { ROLES } from '../../constants/roles';
import {
  getAdminDashboard,
  getAssetManagerDashboard,
  getDepartmentDashboard,
  getEmployeeDashboard
} from './dashboard.controller';

const router = Router();

// Protect all dashboard routes
router.use(authenticate);

router.get('/admin', authorize(ROLES.ADMIN), getAdminDashboard);
router.get('/asset-manager', authorize(ROLES.ASSET_MANAGER), getAssetManagerDashboard);
router.get('/department', authorize(ROLES.DEPARTMENT_HEAD), getDepartmentDashboard);
router.get('/employee', authorize(ROLES.EMPLOYEE), getEmployeeDashboard);

export default router;
