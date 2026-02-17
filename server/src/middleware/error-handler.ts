import { Request, Response, NextFunction } from 'express';

interface ErrorResponse {
  success: false;
  error: {
    message: string;
    code: string;
  };
  timestamp: string;
}

/**
 * Centralized error handling middleware
 */
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('Error:', err);

  const errorResponse: ErrorResponse = {
    success: false,
    error: {
      message: err.message || 'An unexpected error occurred',
      code: 'INTERNAL_SERVER_ERROR'
    },
    timestamp: new Date().toISOString()
  };

  // Determine status code based on error type
  let statusCode = 500;

  if (err.message.includes('not found') || err.message.includes('Not found')) {
    statusCode = 404;
    errorResponse.error.code = 'NOT_FOUND';
  } else if (err.message.includes('invalid') || err.message.includes('Invalid')) {
    statusCode = 400;
    errorResponse.error.code = 'INVALID_REQUEST';
  } else if (err.message.includes('unauthorized') || err.message.includes('Unauthorized')) {
    statusCode = 401;
    errorResponse.error.code = 'UNAUTHORIZED';
  } else if (err.message.includes('connection') || err.message.includes('timeout')) {
    statusCode = 503;
    errorResponse.error.code = 'SERVICE_UNAVAILABLE';
  }

  res.status(statusCode).json(errorResponse);
};

/**
 * Async error wrapper to catch errors in async route handlers
 */
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
