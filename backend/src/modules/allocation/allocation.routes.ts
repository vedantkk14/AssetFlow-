import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.middleware';
import { authorize } from '../../middlewares/rbac.middleware';
import { validate } from '../../middlewares/validate.middleware';
import { ROLES } from '../../constants/roles';
import * as allocationController from './allocation.controller';
import { approveReturnSchema, createAllocationSchema, requestReturnSchema } from './allocation.validation';

const router = Router();

router.use(authenticate);

router.get(
  '/history/:assetId',
  authorize(ROLES.ADMIN, ROLES.ASSET_MANAGER, ROLES.DEPARTMENT_HEAD),
  allocationController.getAllocationHistory
);

router.post(
  '/',
  authorize(ROLES.ADMIN, ROLES.ASSET_MANAGER),
  validate(createAllocationSchema),
  allocationController.createAllocation
);

router.get('/', allocationController.listAllocations);

router.get('/:id', allocationController.getAllocation);

router.patch(
  '/:id/return',
  authorize(ROLES.ADMIN, ROLES.ASSET_MANAGER, ROLES.EMPLOYEE),
  validate(requestReturnSchema),
  allocationController.requestReturn
);

router.patch(
  '/:id/approve-return',
  authorize(ROLES.ADMIN, ROLES.ASSET_MANAGER),
  validate(approveReturnSchema),
  allocationController.approveReturn
);

export default router;
