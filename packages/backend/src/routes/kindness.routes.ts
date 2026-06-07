import { Router, Request, Response, NextFunction, RequestHandler } from 'express';
import { createKindnessLog, getKindnessLogsByUser } from '../controllers/kindness.controller.js'; // Native ESM requires .js extension

const router = Router();

// Utility wrapper to catch async handler rejections and delegate to global error handler
const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>): RequestHandler => 
  (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

/**
 * Route Configuration
 * Maps 'POST /' (which will be prefixed by the main server entry) 
 * straight to our secure point-allocating controller.
 */
router.post('/', asyncHandler(createKindnessLog));

/**
 * Maps 'GET /user/:userId' (prefixed by /api/kindness) to retrieve logs for a specific user.
 */
router.get('/user/:userId', asyncHandler(getKindnessLogsByUser));

export default router;