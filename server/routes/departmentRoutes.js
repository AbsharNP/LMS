import { Router } from 'express';
import {
  createDepartment,
  deleteDepartment,
  getDepartments,
  updateDepartment,
} from '../controllers/departmentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

router.use(protect);

router.route('/').get(getDepartments).post(createDepartment);
router.route('/:id').put(updateDepartment).delete(deleteDepartment);

export default router;
