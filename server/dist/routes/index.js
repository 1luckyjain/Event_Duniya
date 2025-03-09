import { Router } from 'express';
import authRouter from './auth/auth.route.js';
import artistRouter from './artist/artist.route.js';
import userRouter from './user/user.route.js';
// Import other routers as needed
const router = Router();
router.use('/auth', authRouter);
router.use('/artist', artistRouter);
router.use('/user', userRouter);
// Add other routes as needed
export default router;
//# sourceMappingURL=index.js.map