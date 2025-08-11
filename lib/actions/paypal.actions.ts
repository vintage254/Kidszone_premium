"use server";

import { auth } from "@clerk/nextjs/server";
import { getUserByClerkId } from "@/lib/services/user.service";
import { db } from "@/database/drizzle";
import { orders, products } from "@/database/schema";
import { eq } from "drizzle-orm";

const { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET } = process.env;
const base = "https://api-m.sandbox.paypal.com";

/**
 * Generate an OAuth 2.0 access token for authenticating with PayPal REST APIs.
 * @see https://developer.paypal.com/api/rest/authentication/
 */
const generateAccessToken = async () => {
  try {
    if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
      throw new Error("MISSING_API_CREDENTIALS");
    }
    const auth = Buffer.from(
      PAYPAL_CLIENT_ID + ":" + PAYPAL_CLIENT_SECRET,
    ).toString("base64");
    const response = await fetch(`${base}/v1/oauth2/token`, {
      method: "POST",
      body: "grant_type=client_credentials",
      headers: {
        Authorization: `Basic ${auth}`,
      },
    });

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error("Failed to generate Access Token:", error);
    throw error;
  }
};

/**
 * Create an order with PayPal.
 * @see https://developer.paypal.com/docs/api/orders/v2/#orders_create
 */
export const createPaypalOrder = async (productId: string) => {
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

  const accessToken = await generateAccessToken();
  const url = `${base}/v2/checkout/orders`;
  const payload = {
    intent: "CAPTURE",
    purchase_units: [
      {
        amount: {
          currency_code: "USD",
          value: product.price,
        },
        custom_id: newOrder.id, // Pass our order ID to PayPal
      },
    ],
  };

  try {
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      method: "POST",
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    return { success: true, orderId: data.id };

  } catch (error) {
    console.error("Failed to create PayPal order:", error);
    return { success: false, message: "Failed to create PayPal order." };
  }
};

/**
 * Capture payment for an order.
 * @see https://developer.paypal.com/docs/api/orders/v2/#orders_capture
 */
export const capturePaypalOrder = async (paypalOrderId: string) => {
  const accessToken = await generateAccessToken();
  const url = `${base}/v2/checkout/orders/${paypalOrderId}/capture`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const data = await response.json();

    if (data.status === 'COMPLETED') {
      // Extract our internal order ID from the purchase unit
      const ourOrderId = data.purchase_units[0]?.custom_id;
      if (ourOrderId) {
        await db
          .update(orders)
          .set({ status: 'PAID' })
          .where(eq(orders.id, ourOrderId));
        return { success: true, data };
      } else {
        throw new Error('Our custom order ID was not found in PayPal response.');
      }
    } else {
      throw new Error(`PayPal capture failed with status: ${data.status}`);
    }
  } catch (error) {
    console.error("Failed to capture PayPal order:", error);
    return { success: false, message: "Failed to capture PayPal order." };
  }
};
