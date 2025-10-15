import { Router } from 'express';
import authMiddleware from '../middlewares/authMiddleware.ts';
import PostController from '../controllers/post.controllers.ts';

const postRoutes = Router();

postRoutes.get('/post', authMiddleware, PostController.getUser);
postRoutes.post('/posts', authMiddleware, PostController.createPost);

export default postRoutes;
