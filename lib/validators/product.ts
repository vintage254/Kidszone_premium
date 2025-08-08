import { z } from "zod";

export const productFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.coerce.number().positive("Price must be a positive number"),
  category: z.string().min(2, "Category must be at least 2 characters"),
  images: z.array(z.string().url()).max(4, "You can upload a maximum of 4 images."),
  isFeatured: z.boolean().optional(),
  isBanner: z.boolean().optional(),
});

export type ProductFormValues = z.infer<typeof productFormSchema>;
