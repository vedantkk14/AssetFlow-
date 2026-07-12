import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.middleware';
import { authorize } from '../../middlewares/rbac.middleware';
import { validate } from '../../middlewares/validate.middleware';
import { ROLES } from '../../constants/roles';
import * as categoryController from './category.controller';
import { createCategorySchema, updateCategorySchema } from './category.validation';
import { statusUpdateSchema } from './organization.validation';

const router = Router();

router.use(authenticate, authorize(ROLES.ADMIN));

router.get('/', categoryController.listCategories);
router.get('/:id', categoryController.getCategory);
router.post('/', validate(createCategorySchema), categoryController.createCategory);
router.put('/:id', validate(updateCategorySchema), categoryController.updateCategory);
router.patch('/:id/status', validate(statusUpdateSchema), categoryController.updateCategoryStatus);
router.delete('/:id', categoryController.deleteCategory);

export default router;
