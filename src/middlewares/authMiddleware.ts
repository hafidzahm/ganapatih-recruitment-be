import type { NextFunction, Response } from 'express';
import type { CustomRequest, UserPayload } from '../types/customRequest.ts';
import JwtService from '../utils/jwt.ts';

export default function authMiddleware(
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) {
  const authorization = req?.headers?.authorization;
  //   console.log({ authorization });
  if (!authorization) {
    throw {
      type: 'AuthenticationError',
      message: 'Invalid token',
    };
  }

  const [bearer, token] = authorization.split(' ');
  if (bearer !== 'Bearer' || !token) {
    throw {
      type: 'AuthenticationError',
      message: 'Invalid token',
    };
  }

  const isVerified = JwtService.verify(token) as UserPayload;
  if (!isVerified) {
    throw {
      type: 'AuthenticationError',
      message: 'Invalid token',
    };
  }
  console.log({ isVerified });

  req.user = { id: isVerified.id, username: isVerified.username };

  next();
}
