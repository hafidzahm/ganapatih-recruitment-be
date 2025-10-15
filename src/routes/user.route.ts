import { Router } from 'express';
import UserController from '../controllers/user.controllers.ts';

const userRoutes = Router();

userRoutes.post('/users', UserController.registerUser);

export default userRoutes;
