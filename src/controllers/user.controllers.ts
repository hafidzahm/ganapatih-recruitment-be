import type { NextFunction, Request, Response } from 'express';
import UserService from '../services/user.services.ts';

class UserController {
  static async registerUser(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await UserService.registerUser(req.body);

      return res.status(201).json({
        id: user.id,
        username: user.username,
      });
    } catch (error) {
      console.log({ error });

      next(error);
    }
  }
}

export default UserController;
