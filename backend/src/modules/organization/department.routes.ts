import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.middleware';
import { authorize } from '../../middlewares/rbac.middleware';
import { validate } from '../../middlewares/validate.middleware';
import { ROLES } from '../../constants/roles';
import * as departmentController from './department.controller';
import { createDepartmentSchema, updateDepartmentSchema } from './department.validation';
import { statusUpdateSchema } from './organization.validation';

const router = Router();

router.use(authenticate, authorize(ROLES.ADMIN));

router.get('/', departmentController.listDepartments);
router.get('/:id', departmentController.getDepartment);
router.post('/', validate(createDepartmentSchema), departmentController.createDepartment);
router.put('/:id', validate(updateDepartmentSchema), departmentController.updateDepartment);
router.patch('/:id/status', validate(statusUpdateSchema), departmentController.updateDepartmentStatus);
router.delete('/:id', departmentController.deleteDepartment);

export default router;
