import type { NextFunction, Response } from 'express';
import type { CustomRequest, UserPayload } from '../types/customRequest.ts';
import JwtService from '../utils/jwt.ts';
import UserService from '../services/user.services.ts';

export default async function authMiddleware(
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) {
  const authorization = req?.cookies?.Authorization;
  console.log({ authorization });
  if (!authorization) {
    throw {
      type: 'AuthenticationError',
      message: 'Invalid token',
    };
  }

  const [bearer, token] = authorization.split(' ');
  console.log({ bearer, token });

  if (bearer !== 'Bearer' || !token) {
    throw {
      type: 'AuthenticationError',
      message: 'Invalid token',
    };
  }

  const isVerified = JwtService.verifyAccess(token) as UserPayload;
  console.log({ isVerified });

  if (!isVerified) {
    throw {
      type: 'AuthenticationError',
      message: 'Invalid token',
    };
  }

  const user = (await UserService.findUserById(isVerified.id)) as UserPayload;
  // console.log({ userInReqUser: user });

  req.user = {
    id: user.id,
    username: user.username,
    refresh_token: user.refresh_token,
  };

  next();
}
