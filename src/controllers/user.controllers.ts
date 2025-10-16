import type { NextFunction, Request, Response } from 'express';
import UserService from '../services/user.services.ts';
import { loginSchema, registerSchema } from '../utils/schemas/user.schemas.ts';
import BcryptService from '../utils/bcrypt.ts';
import JwtService from '../utils/jwt.ts';
import type { CustomRequest } from '../types/customRequest.ts';

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
          message: 'User not found',
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
      //simpen di cookies
      const bearerToken = `Bearer ${token}`;
      res.cookie('Authorization', bearerToken, {
        maxAge: 900000,
        httpOnly: true,
      });
      return res.status(200).json({
        token,
      });
    } catch (error) {
      next(error);
    }
  }

  static async logout(req: CustomRequest, res: Response, next: NextFunction) {
    try {
      const user = req?.user;
      // console.log({ user });
      if (!user) {
        throw {
          type: 'BadRequest',
          message: 'Logout failed',
        };
      } else {
        res.cookie('Authorization', '', {
          httpOnly: true,
          expires: new Date(0),
        });
        return res.status(200).json({
          success: true,
          message: 'Logout success',
        });
      }
    } catch (error) {
      next(error);
    }
  }

  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      console.log({ query: req?.query });
      const search = req?.query?.search as string;
      let page = (Number(req?.query?.page) as number) || 1;
      page === 0 ? (page = 1) : page;
      let limit = (Number(req?.query?.limit) as number) || 10;
      limit === 0 ? (limit = 1) : limit;
      const skip = (page - 1) * limit;

      const take = limit;
      const totalUser = (await UserService.countAllUser(search)) as number;
      const totalPages = Math.ceil(totalUser / limit);
      const users = await UserService.getAllUser(take, skip, search);

      return res.status(200).json({
        users: users,
        totalPages,
        page,
        dataPerPage: limit,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getMyProfile(
    req: CustomRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const loginId = req?.user?.id as string;
      if (!loginId) {
        throw {
          type: 'BadRequest',
          message: 'Failed to get my profile',
        };
      } else {
        const user = await UserService.findUserById(loginId);
        return res.status(200).json({
          success: true,
          message: 'Get my profile successfully finish',
          user,
        });
      }
    } catch (error) {
      next(error);
    }
  }
}

export default UserController;
