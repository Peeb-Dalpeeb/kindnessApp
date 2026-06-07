import { Schema, model } from 'mongoose';

/**
 * 1. Mongoose Document Interface
 * Represents a pre-populated user stored in the database.
 */
export interface IUser {
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * 2. Mongoose Schema Definition
 * Enforces uniqueness and required constraints on the name field.
 */
const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'User name is required'],
      trim: true,
      unique: true,
    },
  },
  {
    // Automatically creates 'createdAt' and 'updatedAt' timestamps for every entry
    timestamps: true,
  }
);

/**
 * 3. Model Compilation
 * Creates the 'User' collection inside MongoDB.
 */
export const UserModel = model<IUser>('User', UserSchema);
