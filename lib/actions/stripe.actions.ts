"use server";

import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { getUserByClerkId } from "@/lib/services/user.service";
import { db } from "@/database/drizzle";
import { orders, products } from "@/database/schema";
import { stripe } from "@/lib/stripe";
import { eq } from "drizzle-orm";

export async function createCheckoutSession(productId: string) {
  const { userId: clerkUserId } = await auth();

  if (!clerkUserId) {
    return { success: false, message: "User not authenticated." };
  }

  // Find corresponding database user (UUID)
  const dbUser = await getUserByClerkId(clerkUserId);
  if (!dbUser) {
    return { success: false, message: "Database user not found for the authenticated account." };
  }

  const product = await db.query.products.findFirst({
    where: eq(products.id, productId),
  });

  if (!product) {
    return { success: false, message: "Product not found." };
  }

  let newOrder;
  try {
    [newOrder] = await db.insert(orders).values({
      userId: dbUser.id,
      productId,
      status: 'PENDING',
    }).returning();
  } catch (error) {
    console.error("Database Error:", error);
    return { success: false, message: "Database Error: Failed to create order." };
  }

  try {
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: product.title,
              images: product.image1 ? [product.image1] : [],
            },
            unit_amount: Math.round(parseFloat(product.price) * 100), // Price in cents
          },
          quantity: 1,
        },
      ],
      metadata: {
        orderId: newOrder.id,
      },
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/orders?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/products/${productId}?canceled=true`,
    });

    if (!checkoutSession.url) {
        return { success: false, message: "Could not create Stripe session." };
    }

    return { success: true, url: checkoutSession.url };

  } catch (error) {
    console.error("Stripe Error:", error);
    return { success: false, message: "Stripe Error: Failed to create checkout session." };
  }
}
