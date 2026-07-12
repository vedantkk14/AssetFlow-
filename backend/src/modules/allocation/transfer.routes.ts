import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.middleware';
import { authorize } from '../../middlewares/rbac.middleware';
import { validate } from '../../middlewares/validate.middleware';
import { ROLES } from '../../constants/roles';
import * as transferController from './transfer.controller';
import { createTransferSchema } from './transfer.validation';

const router = Router();

router.use(authenticate);

router.post('/', validate(createTransferSchema), transferController.createTransfer);

router.get('/', transferController.listTransfers);

router.patch(
  '/:id/approve',
  authorize(ROLES.ADMIN, ROLES.ASSET_MANAGER, ROLES.DEPARTMENT_HEAD),
  transferController.approveTransfer
);

router.patch(
  '/:id/reject',
  authorize(ROLES.ADMIN, ROLES.ASSET_MANAGER, ROLES.DEPARTMENT_HEAD),
  transferController.rejectTransfer
);

export default router;
