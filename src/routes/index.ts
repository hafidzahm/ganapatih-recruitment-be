import { Router } from 'express';
import homeRoute from './home.route.ts';

const router = Router();

router.use(homeRoute);

export default router;
