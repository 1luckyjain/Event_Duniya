import { Router } from 'express';
import { generateAuthTokens } from '../../middlewares/generateauthtoken.middleware.js';
import { authController } from '../../controllers/auth/index.js';
const router = Router();
router.post('/signup', authController.signUp, generateAuthTokens);
router.post('/login', authController.login, generateAuthTokens);
router.post('/refresh', authController.refreshAccessToken);
router.post('/logout', authController.logout); // Confirming no authentication requirement
router.post('/google', authController.googleAuth, generateAuthTokens);
export default router;
//# sourceMappingURL=auth.route.js.map