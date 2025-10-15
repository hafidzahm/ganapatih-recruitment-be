import { Router } from 'express';
import homeRoute from './home.route.ts';
import userRoutes from './user.route.ts';
import postRoutes from './post.route.ts';
import followRoutes from './follow.route.ts';
import feedRoutes from './feed.route.ts';

const router = Router();

router.use(homeRoute);
router.use('/api', userRoutes);
router.use('/api', postRoutes);
router.use('/api', followRoutes);
router.use('/api', feedRoutes);

export default router;
