import { Router, Request, Response, NextFunction, RequestHandler } from 'express';
import { createUser } from '../controllers/user.controller.js';

const router = Router();

// Reusable wrapper to forward async errors to your global error handler middleware
const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>): RequestHandler => 
  (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

/**
 * Route Configuration
 * Maps 'POST /' straight to our validation-secured user creator.
 */
router.post('/', asyncHandler(createUser));

export default router;