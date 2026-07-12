import { Router } from 'express';
import authRoutes from '../modules/auth/auth.routes';
import organizationRoutes from '../modules/organization/organization.routes';
import dashboardRoutes from '../modules/dashboard/dashboard.routes';
import allocationRoutes from '../modules/allocation/allocation.routes';
import transferRoutes from '../modules/allocation/transfer.routes';
import assetsRoutes from '../modules/assets/assets.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use(organizationRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/allocations', allocationRoutes);
router.use('/transfers', transferRoutes);
router.use('/assets', assetsRoutes);

export default router;
