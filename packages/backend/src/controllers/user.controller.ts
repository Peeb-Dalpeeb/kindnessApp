import { Request, Response } from 'express';
import { UserSchema } from '@kindness/shared';
import { UserModel } from '../models/User.js'; // Native ESM requires .js

/**
 * Handles pre-populating individuals in the system.
 * 1. Validates the incoming payload against the shared Zod schema.
 * 2. Checks if the unique name already exists to prevent duplicate profiles.
 * 3. Commits the record to MongoDB and returns the generated ObjectId.
 */
export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    // 1. Validate input payload via shared contract rules
    const validationResult = UserSchema.safeParse(req.body);

    if (!validationResult.success) {
      res.status(400).json({
        message: 'Validation failed',
        errors: validationResult.error.format()
      });
      return;
    }

    const { name } = validationResult.data;

    // 2. Prevent duplication crashes by checking for existing usernames first
    const existingUser = await UserModel.findOne({ name });
    if (existingUser) {
      res.status(409).json({
        message: `An individual named "${name}" is already pre-populated in the system.`
      });
      return;
    }

    // 3. Commit the fresh user profile record to MongoDB
    const newUser = await UserModel.create({ name });

    res.status(201).json({
      message: 'User created successfully!',
      data: newUser
    });
  } catch (error) {
    console.error('[user.controller]: Error creating user:', error);
    res.status(500).json({
      message: 'An internal server error occurred while processing your request.'
    });
  }
};