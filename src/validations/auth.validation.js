import { z } from 'zod';

export const signupSchema = z.object({
  name: z.string().min(2).max(50).trim(),
  email: z.string().email().max(255).toLowerCase().trim(),
  password: z.string().min(6).max(255),
  role: z.enum(['admin', 'user', 'guest']).default('user'),
});

export const SignInSchema = z.object({
  email: z.string().email().max(255).toLowerCase().trim(),
  password: z.string().min(1),
});
