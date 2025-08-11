"use server";

import { db } from "@/database/drizzle";
import { orders, products, users } from "@/database/schema";
import { desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { updateOrderSchema } from "@/lib/schemas/order.schemas";

export async function getOrders() {
  try {
    const data = await db
      .select({
        orderId: orders.id,
        productTitle: products.title,
        customerEmail: users.email,
        status: orders.status,
        trackingNumber: orders.trackingNumber,
        createdAt: orders.createdAt,
        price: products.price,
      })
      .from(orders)
      .leftJoin(users, eq(orders.userId, users.id))
      .leftJoin(products, eq(orders.productId, products.id))
      .orderBy(desc(orders.createdAt));

    return { success: true, data };
  } catch (error) {
    console.error("Database Error:", error);
    return { success: false, message: "Database Error: Failed to fetch orders." };
  }
}



export async function updateOrder(orderId: string, values: z.infer<typeof updateOrderSchema>) {
  const validatedFields = updateOrderSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Error: Please check the form fields.",
    };
  }

  try {
    await db
      .update(orders)
      .set({
        status: validatedFields.data.status,
        trackingNumber: validatedFields.data.trackingNumber,
      })
      .where(eq(orders.id, orderId));

    revalidatePath("/admin/orders");
    return { success: true, message: "Order updated successfully." };
  } catch (error) {
    console.error("Database Error:", error);
    return { success: false, message: "Database Error: Failed to update order." };
  }
}

export async function getOrdersByUserId() {
  const { userId } = await auth();

  if (!userId) {
    return { success: false, message: "User not authenticated." };
  }

  try {
    const data = await db
      .select({
        orderId: orders.id,
        productTitle: products.title,
        productImage: products.image1, // Assuming image1 is the main image
        status: orders.status,
        trackingNumber: orders.trackingNumber,
        createdAt: orders.createdAt,
        price: products.price,
      })
      .from(orders)
      .leftJoin(users, eq(orders.userId, users.id))
      .leftJoin(products, eq(orders.productId, products.id))
      .where(eq(users.clerkUserId, userId))
      .orderBy(desc(orders.createdAt));

    return { success: true, data };
  } catch (error) {
    console.error("Database Error:", error);
    return { success: false, message: "Database Error: Failed to fetch user orders." };
  }
}
