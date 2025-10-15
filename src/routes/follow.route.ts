import { Router } from 'express';
import FollowController from '../controllers/follow.controllers.ts';
import authMiddleware from '../middlewares/authMiddleware.ts';

const followRoutes = Router();

followRoutes.post(
  '/follow/:userid',
  authMiddleware,
  FollowController.updateFollow,
);

export default followRoutes;
