import { z } from 'zod';

// Auth Validators
export const SignUpSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain an uppercase letter')
    .regex(/[0-9]/, 'Password must contain a number'),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  agreeToTerms: z.boolean().refine((val) => val === true, {
    message: 'You must agree to the terms and conditions',
  }),
});

export const SignInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const ForgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export const ResetPasswordSchema = z.object({
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain an uppercase letter')
    .regex(/[0-9]/, 'Password must contain a number'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

// Order Validators
export const CreateOrderSchema = z.object({
  paperType: z.string().min(1, 'Please select a paper type'),
  topic: z.string().min(10, 'Topic must be at least 10 characters'),
  academicLevel: z.string().min(1, 'Please select academic level'),
  wordCount: z.number().min(100, 'Minimum 100 words').max(100000, 'Maximum 100,000 words'),
  pages: z.number().min(1, 'Minimum 1 page').max(400, 'Maximum 400 pages'),
  citationStyle: z.string().min(1, 'Please select citation style'),
  deadline: z.date().min(new Date(), 'Deadline must be in the future'),
  instructions: z.string().min(20, 'Instructions must be at least 20 characters'),
  attachments: z.array(z.string()).optional(),
  preferences: z.object({}).optional(),
});

export type SignUpInput = z.infer<typeof SignUpSchema>;
export type SignInInput = z.infer<typeof SignInSchema>;
export type CreateOrderInput = z.infer<typeof CreateOrderSchema>;
