import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/apiError';
import { env } from '../config/env';

export const errorHandler = (err: unknown, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.details ?? null,
    });
  }

  console.error(err);

  return res.status(500).json({
    success: false,
    message: 'Internal server error',
    errors: env.NODE_ENV === 'development' ? err : null,
  });
};
