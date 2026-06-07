import { z } from 'zod';

/**
 * 1. Tuple Source of Truth
 * A read-only array containing specific string literals for kindness categories.
 */
export const CATEGORY_LABELS = [
  'Kind Words',
  'Helping Hand',
  'Sharing & Generosity',
  'Special Surprise'
] as const;

/**
 * 2. Kindness Categories & Point Values Constant
 * This acts as the configuration source of truth for the app's gamified mechanics.
 * Derives its labels directly from indices of CATEGORY_LABELS to preserve strong literal type tracking.
 */
export const KINDNESS_CATEGORIES = {
  WORDS: { label: CATEGORY_LABELS[0], points: 10 },
  HELPING: { label: CATEGORY_LABELS[1], points: 20 },
  SHARING: { label: CATEGORY_LABELS[2], points: 15 },
  CUSTOM: { label: CATEGORY_LABELS[3], points: 25 }
} as const;

/**
 * 3. The User Schema (The Runtime Rulebook for User Creation)
 * Validates individual user profiles being pre-populated in the system.
 */
export const UserSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Name is required')
    .max(100, 'Name cannot exceed 100 characters')
});

/**
 * 4. The Kindness Log Schema (The Runtime Rulebook)
 * Validates individual acts of kindness submitted by the frontend or processed by the backend.
 */
export const KindnessLogSchema = z.object({
  userId: z
    .string()
    .min(1, 'A valid user ID is required'),
  category: z.enum(CATEGORY_LABELS, {
    errorMap: () => ({ message: 'Please select a valid kindness category' })
  }),
  description: z
    .string()
    .trim()
    .max(200, 'Description cannot exceed 200 characters')
    .optional()
    .transform(val => (val === '' ? undefined : val))
});

/**
 * 5. Compile-Time TypeScript Type Inferences
 * These expose clean definitions to your IDE for autocompletion across workspaces.
 */
export type User = z.infer<typeof UserSchema>;
export type KindnessCategoryMap = typeof KINDNESS_CATEGORIES;
export type KindnessLog = z.infer<typeof KindnessLogSchema>;