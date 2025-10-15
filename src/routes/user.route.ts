import { Router } from 'express';
import UserController from '../controllers/user.controllers.ts';

const userRoutes = Router();

userRoutes.post('/users', UserController.register);
userRoutes.post('/sign-in', UserController.login);

export default userRoutes;
