import { z } from "zod";

const filterSchema = z.object({
  name: z.string().min(1, "Filter name cannot be empty"),
  options: z.array(z.string().min(1, "Option cannot be empty")).min(1, "At least one option is required"),
});

export const productFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.coerce.number().positive("Price must be a positive number"),
  category: z.string().min(2, "Category must be at least 2 characters"),
  images: z.array(z.string().url()).max(4, "You can upload a maximum of 4 images."),
  isFeatured: z.boolean().optional(),
  isBanner: z.boolean().optional(),
  filters: z.array(filterSchema).optional(),
});

export type ProductFormValues = z.infer<typeof productFormSchema>;
