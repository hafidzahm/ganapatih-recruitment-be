import type { NextFunction, Request, Response } from 'express';
import UserService from '../services/user.services.ts';
import { loginSchema, registerSchema } from '../utils/schemas/user.schemas.ts';
import BcryptService from '../utils/bcrypt.ts';
import JwtService from '../utils/jwt.ts';
import type { CustomRequest, UserPayload } from '../types/customRequest.ts';

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

      const refresh = JwtService.refresh({
        id: user.id,
        username: user.username,
      });

      const token = JwtService.sign({
        id: user.id,
        username: user.username,
        refresh_token: refresh,
      });

      const refreshToken = `Bearer ${refresh}`;
      const bearerToken = `Bearer ${token}`;

      //simpan di db
      await UserService.updateRefreshToken(refresh, user.id);

      res.cookie('Authorization', bearerToken, {
        maxAge: 900000,
        sameSite: 'lax',
        httpOnly: true,
        secure: true,
      });
      res.cookie('Refresh', refreshToken, {
        maxAge: 900000,
        sameSite: 'lax',
        httpOnly: true,
        secure: true,
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
      const user = req?.user as UserPayload;
      const refresh = user.refresh_token;
      // console.log({ user });
      if (!refresh) {
        throw {
          type: 'BadRequest',
          message: 'Logout failed',
        };
      }

      const checkRefresh = JwtService.verify(refresh);
      if (!checkRefresh) {
        throw {
          type: 'BadRequest',
          message: 'Logout failed',
        };
      }

      await UserService.updateRefreshToken(user.id);
      res.clearCookie('Authorization');
      res.clearCookie('Refresh');
      return res.status(200).json({
        success: true,
        message: 'Logout success',
      });
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

  static async refresh(req: CustomRequest, res: Response, next: NextFunction) {
    try {
      const refresh = req?.cookies['Refresh'];
      if (!refresh) {
        throw {
          type: 'BadRequest',
          message: 'Failed to refresh-token',
        };
      }

      res.cookie('Authorization', refresh, {
        maxAge: 900000,
        httpOnly: true,
        sameSite: 'none',
      });

      console.log('Refresh token is used');

      //simpen di cookies

      return res.status(200).json({
        refresh,
      });
    } catch (error) {
      next(error);
    }
  }

  static async checkRefreshTokenOnDB(
    req: CustomRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const refresh = req?.user?.refresh_token;
      console.log({ refresh });

      if (!refresh) {
        throw { type: 'AuthenticationError', message: 'Invalid refresh token' };
      }

      const validate = JwtService.verify(refresh);
      console.log({ validate });

      if (!validate) {
        throw { type: 'AuthenticationError', message: 'Invalid refresh token' };
      }

      res.cookie('Authorization', `Bearer ${refresh}`, {
        maxAge: 900000,
        sameSite: 'lax',
        httpOnly: true,
        secure: true,
      });
      return res.status(200).json({
        success: true,
        message: 'Token is valid',
        userid: req.user?.id,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default UserController;
