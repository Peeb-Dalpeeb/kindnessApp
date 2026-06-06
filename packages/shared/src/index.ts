import { z } from 'zod';

export const UserSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  createdAt: z.date().default(() => new Date()),
});

export type User = z.infer<typeof UserSchema>;

export function greetUser(user: User): string {
  return `Hello, ${user.name}! Welcome to KindnessApp.`;
}
