import { Router } from 'express';
import FollowController from '../controllers/follow.controllers.ts';
import authMiddleware from '../middlewares/authMiddleware.ts';

const followRoutes = Router();

followRoutes.post(
  '/follow/:userid',
  authMiddleware,
  FollowController.createFollow,
);
followRoutes.delete(
  '/follow/:userid',
  authMiddleware,
  FollowController.deleteFollow,
);

export default followRoutes;
