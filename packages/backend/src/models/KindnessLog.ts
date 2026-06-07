import { Schema, model, Types } from 'mongoose';
import { type KindnessLog, CATEGORY_LABELS } from '@kindness/shared';

/**
 * 1. Mongoose Document Interface
 * A pure data-only interface representing the database record structure.
 * Replaces the shared personName field with a relational userId reference.
 */
export interface IKindnessLog extends Omit<KindnessLog, 'userId' | 'personName' | 'description'> {
  userId: Types.ObjectId;
  description?: string;
  pointsEarned: number;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * 2. Mongoose Schema Definition
 * This mirrors our shared Zod schema rules inside MongoDB itself.
 * userId is a relational ObjectId reference to the pre-populated User collection.
 */
const KindnessLogSchema = new Schema<IKindnessLog>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: {
        values: CATEGORY_LABELS,
        message: '{VALUE} is not a valid kindness category',
      },
    },
    pointsEarned: {
      type: Number,
      required: [true, 'Points earned is required'],
      min: [1, 'Points must be a positive number'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [200, 'Description cannot exceed 200 characters'],
    },
  },
  {
    // Automatically creates 'createdAt' and 'updatedAt' timestamps for every entry
    timestamps: true,
  }
);

/**
 * 3. Model Compilation
 * Creates the 'KindnessLog' collection inside MongoDB.
 */
export const KindnessLogModel = model<IKindnessLog>('KindnessLog', KindnessLogSchema);