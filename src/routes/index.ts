import { Router } from 'express';
import homeRoute from './home.route.ts';
import userRoutes from './user.route.ts';

const router = Router();

router.use(homeRoute);
router.use('/api', userRoutes);

export default router;
