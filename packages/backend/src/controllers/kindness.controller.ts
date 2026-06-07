import { Request, Response } from 'express';
import { Types } from 'mongoose';
import { KindnessLogSchema, KINDNESS_CATEGORIES } from '@kindness/shared';
import { KindnessLogModel } from '../models/KindnessLog.js'; // Note the .js extension for native ESM
import { UserModel } from '../models/User.js';

/**
 * Handles the creation of a new Kindness Log.
 * 1. Validates the incoming body against the shared Zod schema.
 * 2. Securely computes points on the server side using the category configuration.
 * 3. Commits the records to MongoDB.
 */
export const createKindnessLog = async (req: Request, res: Response): Promise<void> => {
  try {
    // 1. Intercept the incoming request payload and validate via the shared rulebook
    const validationResult = KindnessLogSchema.safeParse(req.body);

    if (!validationResult.success) {
      // If validation fails, exit early and return structured error hints to the frontend
      res.status(400).json({
        message: 'Validation failed',
        errors: validationResult.error.format()
      });
      return;
    }

    // Extract the pristine, formatted data values from the successful Zod parser
    const { userId, category, description } = validationResult.data;

    // 2. Secure Server-Side Point Mapping (The Option B choice from your audit!)
    // Look up the matching category object inside our shared configuration mapping
    const matchedCategoryConfig = Object.values(KINDNESS_CATEGORIES).find(
      (c) => c.label === category
    );

    if (!matchedCategoryConfig) {
      res.status(500).json({
        message: 'Configuration error: Category point mapping not found.'
      });
      return;
    }

    const pointsEarned = matchedCategoryConfig.points;

    // 3. Save the record to MongoDB using the Mongoose model
    const newLog = await KindnessLogModel.create({
      userId,
      category,
      pointsEarned,
      description
    });

    // Send a successful 201 Created response along with the fresh database entry
    res.status(201).json({
      message: 'Kindness recorded successfully!',
      data: newLog
    });
  } catch (error) {
    console.error('[kindness.controller]: Error creating log:', error);
    res.status(500).json({
      message: 'An internal server error occurred while processing your request.'
    });
  }
};

/**
 * Retrieves all kindness logs for a specific user.
 * 1. Validates that the provided userId is a valid MongoDB ObjectId.
 * 2. Checks if the user exists in the database.
 * 3. Retrieves the user's kindness logs from MongoDB, sorted by creation date (newest first).
 */
export const getKindnessLogsByUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;

    // 1. Validate ObjectId format
    if (!userId || !Types.ObjectId.isValid(userId)) {
      res.status(400).json({
        message: 'Invalid user ID format.'
      });
      return;
    }

    // 2. Verify the user actually exists
    const userExists = await UserModel.exists({ _id: userId });
    if (!userExists) {
      res.status(404).json({
        message: 'User not found.'
      });
      return;
    }

    // 3. Retrieve logs sorted by newest first
    const logs = await KindnessLogModel.find({ userId }).sort({ createdAt: -1 });

    res.status(200).json({
      message: 'Kindness logs retrieved successfully.',
      data: logs
    });
  } catch (error) {
    console.error('[kindness.controller]: Error getting logs for user:', error);
    res.status(500).json({
      message: 'An internal server error occurred while processing your request.'
    });
  }
};