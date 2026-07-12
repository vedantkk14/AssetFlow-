import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.middleware';
import { authorize } from '../../middlewares/rbac.middleware';
import { validate } from '../../middlewares/validate.middleware';
import { ROLES } from '../../constants/roles';
import * as employeeController from './employee.controller';
import { promoteEmployeeSchema } from './employee.validation';
import { statusUpdateSchema } from './organization.validation';

const router = Router();

router.use(authenticate, authorize(ROLES.ADMIN));

router.get('/', employeeController.listEmployees);
router.get('/:id', employeeController.getEmployee);
router.patch('/:id/promote', validate(promoteEmployeeSchema), employeeController.promoteEmployee);
router.patch('/:id/status', validate(statusUpdateSchema), employeeController.updateEmployeeStatus);

export default router;
