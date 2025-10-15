import type { NextFunction, Response } from 'express';
import type { CustomRequest } from '../types/customRequest.ts';

export default function authMiddleware(
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) {}
