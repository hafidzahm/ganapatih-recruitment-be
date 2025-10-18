import { Router } from 'express';
import UserController from '../controllers/user.controllers.ts';
import authMiddleware from '../middlewares/authMiddleware.ts';

const userRoutes = Router();

userRoutes.get('/users', authMiddleware, UserController.getAll);

userRoutes.post('/register', UserController.register);
userRoutes.post('/login', UserController.login);
// userRoutes.post('/refresh-token', UserController.refresh);

userRoutes.get('/login', authMiddleware, UserController.checkRefreshTokenOnDB);
userRoutes.get('/logout', authMiddleware, UserController.logout);
userRoutes.get('/me', authMiddleware, UserController.getMyProfile);

export default userRoutes;
