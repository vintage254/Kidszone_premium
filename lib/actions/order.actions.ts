"use server";

import { db } from "@/database/drizzle";
import { cart, orderItems, orders, products, users } from "@/database/schema";
import { and, desc, eq, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { updateOrderSchema } from "@/lib/schemas/order.schemas";
import { sendTrackingEmail } from "@/lib/email";

// Cart Actions
export async function addToCart(productId: string, quantity: number, filters?: Record<string, string>) {
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
        return { success: false, message: "User not authenticated." };
    }

    try {
        const user = await db.query.users.findFirst({
            where: eq(users.clerkUserId, clerkUserId),
        });

        if (!user) {
            return { success: false, message: "User not found." };
        }

        // Check for existing cart item with same product and filters
        const existingCartItems = await db
            .select()
            .from(cart)
            .where(and(eq(cart.userId, user.id), eq(cart.productId, productId)));

        let existingCartItem = null;
        if (filters) {
            // Find existing item with matching filters
            existingCartItem = existingCartItems.find(item => {
                const itemFilters = item.filters as Record<string, string> | null;
                if (!itemFilters && Object.keys(filters).length === 0) return true;
                if (!itemFilters || !filters) return false;
                return JSON.stringify(itemFilters) === JSON.stringify(filters);
            });
        } else {
            // Find existing item with no filters
            existingCartItem = existingCartItems.find(item => !item.filters);
        }

        if (existingCartItem) {
            await db
                .update(cart)
                .set({ quantity: existingCartItem.quantity + quantity })
                .where(eq(cart.id, existingCartItem.id));
        } else {
            await db.insert(cart).values({
                userId: user.id,
                productId,
                quantity,
                filters: filters ? filters : null,
            });
        }
        revalidatePath("/cart");
        return { success: true, message: "Item added to cart." };
    } catch (error) {
        console.error("Database Error:", error);
        return { success: false, message: "Database Error: Failed to add item to cart." };
    }
}

export async function getCart() {
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
        return { success: false, message: "User not authenticated." };
    }

    try {
        const user = await db.query.users.findFirst({
            where: eq(users.clerkUserId, clerkUserId),
        });

        if (!user) {
            return { success: false, message: "User not found." };
        }

        const cartItems = await db
            .select({
                cartId: cart.id,
                quantity: cart.quantity,
                filters: cart.filters,
                createdAt: cart.createdAt,
                product: products,
            })
            .from(cart)
            .leftJoin(products, eq(cart.productId, products.id))
            .where(eq(cart.userId, user.id));

        return { success: true, data: cartItems };
    } catch (error) {
        console.error("Database Error:", error);
        return { success: false, message: "Database Error: Failed to fetch cart." };
    }
}

export async function removeFromCart(cartId: string) {
    try {
        await db.delete(cart).where(eq(cart.id, cartId));
        revalidatePath("/cart");
        return { success: true, message: "Item removed from cart." };
    } catch (error) {
        console.error("Database Error:", error);
        return { success: false, message: "Database Error: Failed to remove item from cart." };
    }
}

// Explicitly clear entire cart for the authenticated user
export async function clearUserCart() {
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
        return { success: false, message: "User not authenticated." };
    }

    try {
        const user = await db.query.users.findFirst({
            where: eq(users.clerkUserId, clerkUserId),
        });

        if (!user) {
            return { success: false, message: "User not found." };
        }

        await db.delete(cart).where(eq(cart.userId, user.id));
        revalidatePath("/cart");
        return { success: true };
    } catch (error) {
        console.error("Database Error:", error);
        return { success: false, message: "Database Error: Failed to clear cart." };
    }
}

// Order Actions

export async function createOrder(paymentIntentId: string, total: number, productIds: { productId: string, quantity: number }[]) {
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
        return { success: false, message: "User not authenticated." };
    }

    try {
        const user = await db.query.users.findFirst({
            where: eq(users.clerkUserId, clerkUserId),
        });

        if (!user) {
            return { success: false, message: "User not found." };
        }

        // Fetch product prices from DB to ensure they haven't changed
        const productDetails = await db.select({ id: products.id, price: products.price }).from(products).where(inArray(products.id, productIds.map(p => p.productId)));

        const newOrder = await db
            .insert(orders)
            .values({
                userId: user.id,
                total: total.toString(),
                stripePaymentIntentId: paymentIntentId,
                status: "PAID",
            })
            .returning({ orderId: orders.id });

        const orderId = newOrder[0].orderId;

        const orderItemsToInsert = productIds.map(item => {
            const productDetail = productDetails.find(p => p.id === item.productId);
            return {
                orderId,
                productId: item.productId,
                quantity: item.quantity,
                price: productDetail ? productDetail.price : "0", // Fallback, should not happen
            }
        });

        await db.insert(orderItems).values(orderItemsToInsert);

        // Clear user's cart
        await db.delete(cart).where(eq(cart.userId, user.id));

        revalidatePath("/orders");
        revalidatePath("/tracking");

        return { success: true, orderId };
    } catch (error) {
        console.error("Database Error:", error);
        return { success: false, message: "Database Error: Failed to create order." };
    }
}


export async function getOrders() {
  try {
    const data = await db
      .select({
        orderId: orders.id,
        customerEmail: users.email,
        status: orders.status,
        trackingNumber: orders.trackingNumber,
        createdAt: orders.createdAt,
        total: orders.total,
        productTitle: products.title,
      })
      .from(orders)
      .leftJoin(users, eq(orders.userId, users.id))
      .leftJoin(orderItems, eq(orders.id, orderItems.orderId))
      .leftJoin(products, eq(orderItems.productId, products.id))
      .orderBy(desc(orders.createdAt));

    // Group by order and aggregate product titles
    const groupedData = data.reduce((acc: any[], row) => {
      const existingOrder = acc.find(order => order.orderId === row.orderId);
      if (existingOrder) {
        if (row.productTitle && !existingOrder.products.includes(row.productTitle)) {
          existingOrder.products += ', ' + row.productTitle;
        }
      } else {
        acc.push({
          orderId: row.orderId,
          customerEmail: row.customerEmail,
          status: row.status,
          trackingNumber: row.trackingNumber,
          createdAt: row.createdAt,
          total: row.total,
          products: row.productTitle || '',
        });
      }
      return acc;
    }, []);

    return { success: true, data: groupedData };
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
    const pre = await db
      .select({
        id: orders.id,
        trackingNumber: orders.trackingNumber,
        userEmail: users.email,
        productTitle: products.title,
      })
      .from(orders)
      .leftJoin(users, eq(orders.userId, users.id))
      .leftJoin(orderItems, eq(orders.id, orderItems.orderId))
      .leftJoin(products, eq(orderItems.productId, products.id))
      .where(eq(orders.id, orderId));

    if (!pre.length) {
        return { success: false, message: "Order not found." };
    }

    const prevTracking = (pre[0].trackingNumber ?? "").trim();
    const customerEmail = pre[0].userEmail;
    const productTitles = pre.map(row => row.productTitle).filter(Boolean).join(', ');

    const nextTracking = (validatedFields.data.trackingNumber ?? "").trim();

    await db
      .update(orders)
      .set({
        status: validatedFields.data.status,
        trackingNumber: validatedFields.data.trackingNumber,
      })
      .where(eq(orders.id, orderId));

    revalidatePath("/admin/orders");
    revalidatePath("/tracking");

    if (customerEmail && nextTracking && nextTracking !== prevTracking) {
      try {
        await sendTrackingEmail({
          to: customerEmail,
          orderId,
          productTitle: productTitles,
          trackingNumber: nextTracking,
        });
      } catch (e) {
        console.error("Failed to send tracking email:", e);
      }
    }

    return { success: true, message: "Order updated successfully." };
  } catch (error) {
    console.error("Database Error:", error);
    return { success: false, message: "Database Error: Failed to update order." };
  }
}

export async function getOrdersByUserId() {
  const { userId: clerkUserId } = await auth();

  if (!clerkUserId) {
    return { success: false, message: "User not authenticated." };
  }

  try {
    const user = await db.query.users.findFirst({
        where: eq(users.clerkUserId, clerkUserId),
    });

    if (!user) {
        return { success: false, message: "User not found." };
    }

    const userOrdersData = await db
      .select({
        orderId: orders.id,
        status: orders.status,
        trackingNumber: orders.trackingNumber,
        createdAt: orders.createdAt,
        total: orders.total,
        itemId: orderItems.id,
        productTitle: products.title,
        productImage: products.image1,
        quantity: orderItems.quantity,
        price: orderItems.price,
      })
      .from(orders)
      .leftJoin(orderItems, eq(orders.id, orderItems.orderId))
      .leftJoin(products, eq(orderItems.productId, products.id))
      .where(eq(orders.userId, user.id))
      .orderBy(desc(orders.createdAt));

    // Group by order
    const groupedOrders = userOrdersData.reduce((acc: any[], row) => {
      const existingOrder = acc.find(order => order.orderId === row.orderId);
      if (existingOrder && row.itemId) {
        existingOrder.items.push({
          productTitle: row.productTitle,
          productImage: row.productImage,
          quantity: row.quantity,
          price: row.price,
        });
      } else if (row.orderId) {
        acc.push({
          orderId: row.orderId,
          status: row.status,
          trackingNumber: row.trackingNumber,
          createdAt: row.createdAt,
          total: row.total,
          items: row.itemId ? [{
            productTitle: row.productTitle,
            productImage: row.productImage,
            quantity: row.quantity,
            price: row.price,
          }] : [],
        });
      }
      return acc;
    }, []);

    const data = groupedOrders;

    return { success: true, data };
  } catch (error) {
    console.error("Database Error:", error);
    return { success: false, message: "Database Error: Failed to fetch user orders." };
  }
}
