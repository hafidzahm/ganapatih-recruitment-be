import { Router } from 'express';
import FollowController from '../controllers/follow.controllers.ts';
import authMiddleware from '../middlewares/authMiddleware.ts';

const followRoutes = Router();

followRoutes.post(
  '/follow/:userid',
  authMiddleware,
  FollowController.updateFollow,
);

followRoutes.post(
  '/follows/:userId',
  authMiddleware,
  FollowController.createFollow,
);
followRoutes.delete(
  '/follows/:userId',
  authMiddleware,
  FollowController.deleteFollow,
);

export default followRoutes;
