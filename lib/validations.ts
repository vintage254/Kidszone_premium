import { z } from "zod";

export const signUpSchema = z
  .object({
    username: z.string().min(3),
    email: z.string().email(),
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
    refNo: z.string().min(1),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const jobSchema = z.object({
  title: z.string().trim().min(3, { message: "Title must be at least 3 characters." }),
  description: z.string().trim().min(10, { message: "Description must be at least 10 characters." }),
  level: z.string().optional(),
  budget: z.string().optional(),
  isPublished: z.boolean().default(false).optional(),
});
