/**
 * Custom API Error class for handling operational errors
 */
class ApiError extends Error {
  statusCode: number;
  isOperational: boolean;
  override stack?: string;

  constructor(statusCode: number, message: string, stack = '') {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default ApiError;
