import { Router } from 'express';
import authMiddleware from '../middlewares/authMiddleware.ts';
import PostController from '../controllers/post.controllers.ts';

const postRoutes = Router();

postRoutes.get('/posts', authMiddleware, PostController.getFollowedPost);
postRoutes.post('/posts', authMiddleware, PostController.createPost);

export default postRoutes;
