import { Request, Response, NextFunction } from 'express';

/**
 * Generic type for Express request handler function
 */
type AsyncFunction<P = any, ResBody = any, ReqBody = any> = (
  req: Request<P, ResBody, ReqBody>,
  res: Response,
  next: NextFunction
) => Promise<any>;

/**
 * Wrapper for async route handlers to eliminate try-catch boilerplate
 * Automatically catches errors and forwards them to Express error handler
 *
 * @param fn - Async route handler function
 * @returns Express middleware function
 *
 * @example
 * ```typescript
 * router.get('/users', asyncHandler(async (req, res) => {
 *   const users = await UserModel.find();
 *   res.json(users);
 * }));
 * ```
 */
export const asyncHandler = <P = any, ResBody = any, ReqBody = any>(
  fn: AsyncFunction<P, ResBody, ReqBody>
) => {
  return (req: Request<P>, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
