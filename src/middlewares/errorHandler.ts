import { Prisma } from '@prisma/client';
import type { NextFunction, Request, Response } from 'express';

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

interface CustomError extends Error {
  type: string;
  message: string;
  details?: string | unknown[];
}
