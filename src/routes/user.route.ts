import { Router } from 'express';
import UserController from '../controllers/user.controllers.ts';
import authMiddleware from '../middlewares/authMiddleware.ts';

const userRoutes = Router();

userRoutes.get('/users', UserController.getAll);
userRoutes.post('/register', UserController.register);
userRoutes.post('/login', UserController.login);
userRoutes.post('/logout', authMiddleware, UserController.logout);
userRoutes.post('/me', authMiddleware, UserController.getMyProfile);

export default userRoutes;
