import { z } from "zod";
import { orders } from "@/database/schema";

export const updateOrderSchema = z.object({
  status: z.enum(orders.status.enumValues),
  trackingNumber: z.string().optional(),
});
