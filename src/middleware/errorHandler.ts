import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import mongoose from 'mongoose';
import ApiError from '../utils/ApiError';
import logger from '../config/logger';

/**
 * Convert Mongoose validation error to ApiError
 */
const handleMongooseValidationError = (err: mongoose.Error.ValidationError) => {
  const errors = Object.values(err.errors).map((error) => error.message);
  return new ApiError(400, `Validation error: ${errors.join(', ')}`);
};

/**
 * Convert Mongoose cast error to ApiError
 */
const handleMongooseCastError = (err: mongoose.Error.CastError) => {
  return new ApiError(400, `Invalid ${err.path}: ${err.value}`);
};

/**
 * Convert MongoDB duplicate key error to ApiError
 */
const handleMongooseDuplicateKeyError = (err: any) => {
  const field = Object.keys(err.keyValue)[0];
  return new ApiError(
    400,
    `Duplicate field value: ${field}. Please use another value`
  );
};

/**
 * Central error handling middleware
 * Handles different types of errors and sends appropriate response
 */
export const errorHandler: ErrorRequestHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  // Log error for debugging
  logger.error('Error:', {
    name: err.name,
    message: err.message,
    stack: err.stack,
  });

  // Default error
  let error = err;

  // Convert known errors to ApiError
  if (err instanceof mongoose.Error.ValidationError) {
    error = handleMongooseValidationError(err);
  } else if (err instanceof mongoose.Error.CastError) {
    error = handleMongooseCastError(err);
  } else if (err.name === 'MongoServerError' && (err as any).code === 11000) {
    error = handleMongooseDuplicateKeyError(err);
  }

  // Send error response
  if (error instanceof ApiError) {
    res.status(error.statusCode).json({
      success: false,
      message: error.message,
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
    });
    return;
  }

  // Unknown error
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && {
      error: err.message,
      stack: err.stack,
    }),
  });
};

/**
 * 404 Not Found middleware
 * Handles requests to non-existent routes
 */
export const notFound = (req: Request, _res: Response, next: NextFunction) => {
  next(new ApiError(404, `Not Found - ${req.originalUrl}`));
};
