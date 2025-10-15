import { Router } from 'express';
import homeRoute from './home.route.ts';
import userRoutes from './user.route.ts';
import postRoutes from './post.route.ts';

const router = Router();

router.use(homeRoute);
router.use('/api', userRoutes);
router.use('/api', postRoutes);

export default router;
