import type { NextFunction, Request, Response } from 'express';
import UserService from '../services/user.services.ts';
import { loginSchema, registerSchema } from '../utils/schemas/user.schemas.ts';
import BcryptService from '../utils/bcrypt.ts';
import JwtService from '../utils/jwt.ts';

class UserController {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      //validasi input dulu
      const validatedData = registerSchema.safeParse(req.body);
      if (validatedData.error) {
        const errorMessage = validatedData.error.issues.map((err) => {
          return err.message;
        });

        const detailError = errorMessage[0];

        throw {
          type: 'ZodValidationError',
          message: 'Validation error',
          details: detailError,
        };
      }
      const user = await UserService.registerUser(validatedData.data);

      return res.status(201).json({
        id: user.id,
        username: user.username,
      });
    } catch (error) {
      console.log({ error });

      next(error);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = loginSchema.safeParse(req.body);
      if (validatedData.error) {
        const errorMessage = validatedData.error.issues.map((err) => {
          return err.message;
        });

        const detailError = errorMessage[0];

        throw {
          type: 'ZodValidationError',
          message: 'Validation error',
          details: detailError,
        };
      }

      const user = await UserService.findUserByUsername(
        validatedData.data.username,
      );
      if (!user) {
        throw {
          type: 'NotFound',
          message: 'Invalid username/ password',
        };
      }

      const hashedPassword = user.password_hash;
      const isPasswordSame = BcryptService.comparePassword(
        validatedData.data.password,
        hashedPassword,
      );

      if (!isPasswordSame) {
        throw {
          type: 'AuthenticationError',
          message: 'Invalid username/ password',
        };
      }

      const token = JwtService.sign({ id: user.id, username: user.username });
      return res.status(200).json({
        token,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default UserController;
