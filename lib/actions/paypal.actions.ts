"use server";

import { auth } from "@clerk/nextjs/server";
import { getUserByClerkId } from "@/lib/services/user.service";
import { db } from "@/database/drizzle";
import { orders, orderItems, products } from "@/database/schema";
import { eq } from "drizzle-orm";

const { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET } = process.env;
const base = process.env.NODE_ENV === 'production' 
  ? "https://api-m.paypal.com" 
  : "https://api-m.sandbox.paypal.com";

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
// Create PayPal order for cart items with shipping info
export const createPaypalCartOrder = async (cartItems: any[], shippingInfo: any) => {
  const { userId: clerkUserId } = await auth();

  if (!clerkUserId) {
    return { success: false, message: "User not authenticated." };
  }

  const dbUser = await getUserByClerkId(clerkUserId);
  if (!dbUser) {
    return { success: false, message: "Database user not found for the authenticated account." };
  }

  // Calculate totals
  let subtotal = 0;
  const paypalItems = [];
  const orderItemsData = [];

  for (const item of cartItems) {
    const product = await db.query.products.findFirst({
      where: eq(products.id, item.productId),
    });

    if (!product) {
      return { success: false, message: `Product not found: ${item.productId}` };
    }

    const itemTotal = parseFloat(product.price) * item.quantity;
    subtotal += itemTotal;

    paypalItems.push({
      name: product.title,
      unit_amount: {
        currency_code: "USD",
        value: product.price
      },
      quantity: item.quantity.toString()
    });

    orderItemsData.push({
      productId: item.productId,
      quantity: item.quantity,
      price: product.price,
    });
  }

  const shipping = 100;
  const total = (subtotal + shipping).toFixed(2);

  // Create order in database
  let newOrder;
  try {
    [newOrder] = await db.insert(orders).values({
      userId: dbUser.id,
      total,
      status: 'PAID', // PayPal orders are marked as PAID when created since payment happens immediately
    }).returning();

    // Create order items
    for (const itemData of orderItemsData) {
      await db.insert(orderItems).values({
        orderId: newOrder.id,
        ...itemData,
      });
    }
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
          value: total,
          breakdown: {
            item_total: {
              currency_code: "USD",
              value: subtotal.toFixed(2)
            },
            shipping: {
              currency_code: "USD",
              value: "100.00"
            }
          }
        },
        items: paypalItems,
        shipping: {
          name: {
            full_name: shippingInfo.fullName
          },
          address: {
            address_line_1: shippingInfo.address1,
            address_line_2: shippingInfo.address2 || "",
            admin_area_2: shippingInfo.city,
            admin_area_1: shippingInfo.state,
            postal_code: shippingInfo.zipCode,
            country_code: "US"
          }
        },
        custom_id: newOrder.id,
      },
    ],
    application_context: {
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/paypal/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cart?canceled=true`,
      brand_name: "KidsZone Premium",
      locale: "en-US",
      landing_page: "BILLING",
      shipping_preference: "SET_PROVIDED_ADDRESS",
      user_action: "PAY_NOW"
    }
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
    
    // Extract approval URL from PayPal response
    const approvalUrl = data.links?.find((link: any) => link.rel === 'approve')?.href;
    
    return { success: true, orderId: data.id, approvalUrl };

  } catch (error) {
    console.error("Failed to create PayPal order:", error);
    return { success: false, message: "Failed to create PayPal order." };
  }
};

export const createPaypalOrder = async (productId: string, quantity = 1, filters?: Record<string, string>) => {
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

  const subtotal = (parseFloat(product.price) * quantity);
  const shipping = 100; // $100 shipping cost
  const total = (subtotal + shipping).toFixed(2);

  let newOrder;
  try {
    [newOrder] = await db.insert(orders).values({
      userId: dbUser.id,
      total,
      status: 'PAID',
    }).returning();

    // Create order item
    await db.insert(orderItems).values({
      orderId: newOrder.id,
      productId,
      quantity,
      price: product.price,
    });
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
          value: total,
          breakdown: {
            item_total: {
              currency_code: "USD",
              value: (parseFloat(product.price) * quantity).toFixed(2)
            },
            shipping: {
              currency_code: "USD",
              value: "100.00"
            }
          }
        },
        items: [
          {
            name: product.title,
            unit_amount: {
              currency_code: "USD",
              value: product.price
            },
            quantity: quantity.toString()
          }
        ],
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
    
    // Extract approval URL from PayPal response
    const approvalUrl = data.links?.find((link: any) => link.rel === 'approve')?.href;
    
    return { success: true, orderId: data.id, approvalUrl };

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
          .set({ 
            status: 'PAID',
            stripePaymentIntentId: paypalOrderId // Store PayPal order ID for reference
          })
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
