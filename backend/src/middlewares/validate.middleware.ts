import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { ApiError } from '../utils/apiError';

export const validate = (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    return next(ApiError.badRequest('Validation failed', result.error.flatten().fieldErrors));
  }

  req.body = result.data;
  next();
};
