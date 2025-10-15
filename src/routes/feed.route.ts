import { Router } from 'express';
import authMiddleware from '../middlewares/authMiddleware.ts';
import PostController from '../controllers/post.controllers.ts';

const feedRoutes = Router();

feedRoutes.get('/feed', authMiddleware, PostController.getFollowedPost);

export default feedRoutes;
