import { Router } from 'express';
import authRoutes from '../modules/auth/auth.routes';
import organizationRoutes from '../modules/organization/organization.routes';
import dashboardRoutes from '../modules/dashboard/dashboard.routes';
import allocationRoutes from '../modules/allocation/allocation.routes';
import transferRoutes from '../modules/allocation/transfer.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use(organizationRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/allocations', allocationRoutes);
router.use('/transfers', transferRoutes);

export default router;
