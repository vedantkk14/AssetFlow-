import { Router } from 'express';
import authRoutes from '../modules/auth/auth.routes';
import organizationRoutes from '../modules/organization/organization.routes';
import dashboardRoutes from '../modules/dashboard/dashboard.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use(organizationRoutes);
router.use('/dashboard', dashboardRoutes);

export default router;
