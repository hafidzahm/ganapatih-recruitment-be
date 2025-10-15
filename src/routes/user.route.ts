import { Router } from 'express';
import UserController from '../controllers/user.controllers.ts';

const userRoutes = Router();

userRoutes.get('/users', UserController.getAll);
userRoutes.post('/register', UserController.register);
userRoutes.post('/login', UserController.login);

export default userRoutes;
