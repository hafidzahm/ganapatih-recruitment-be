import { Prisma } from '@prisma/client';
import type { NextFunction, Request, Response } from 'express';
import type { CustomError } from '../types/customError.ts';

export default function errorHandler(
  error: CustomError,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  console.log('==errorHandler==');
  console.log({ error });

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    console.log(error.code, 'errCode');

    if (error.code === 'P2002') {
      return res.status(409).json({
        success: false,
        message: 'Username already exists',
      });
    }

    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        message: 'Data not found',
        details: 'No record was found',
      });
    }
  }

  if (error.type === 'AuthenticationError') {
    return res.status(401).json({
      success: false,
      message: error.message,
    });
  }

  if (error.type === 'ZodValidationError') {
    return res.status(400).json({
      success: false,
      message: error.message,
      details: error.details,
    });
  }

  return res.status(500).json({
    success: false,
    message: 'Internal Server Error',
  });
}
