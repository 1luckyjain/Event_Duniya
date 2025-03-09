import { Router } from 'express';
import { GenericController } from '../../controllers/genericController.js';
import User from '../../models/User.js';
import { isAuthenticated } from '../../middlewares/isAuthenticated.js';
import { getUserEventIds } from '../../controllers/user/getevent.js';
import { updateUserProfile } from '../../controllers/user/updateProfile.js';
const userController = new GenericController(User);
const router = Router();
router.get('/list', userController.getAll);
router.get('/:id', isAuthenticated('user'), userController.get);
router.post('/events', getUserEventIds);
router.put('/:id', isAuthenticated('user'), updateUserProfile);
export default router;
//# sourceMappingURL=user.route.js.map