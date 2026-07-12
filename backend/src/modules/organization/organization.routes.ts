import { Router } from 'express';
import departmentRoutes from './department.routes';
import categoryRoutes from './category.routes';
import employeeRoutes from './employee.routes';

const router = Router();

router.use('/departments', departmentRoutes);
router.use('/categories', categoryRoutes);
router.use('/employees', employeeRoutes);

export default router;
