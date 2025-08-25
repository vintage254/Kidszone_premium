import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getUserByClerkId } from '@/lib/services/user.service';
import { db } from '@/database/drizzle';
import { orders, orderItems, products, cart } from '@/database/schema';
import { eq } from 'drizzle-orm';
import { stripe } from '@/lib/stripe';

export async function POST(request: NextRequest) {
  try {
    const { cartItems, shippingInfo } = await request.json();

    // Require authentication
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Map to DB user
    const dbUser = await getUserByClerkId(clerkUserId);
    if (!dbUser) {
      return NextResponse.json({ error: 'User record not found' }, { status: 400 });
    }

    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    // Build line items from DB to avoid trusting client prices
    const line_items: any[] = [];
    let totalAmount = 0;

    // Calculate total first
    for (const item of cartItems) {
      const productId = item.productId as string | undefined;
      const quantity = Number(item.quantity) || 1;
      if (!productId) continue;

      const product = await db.query.products.findFirst({ where: eq(products.id, productId) });
      if (!product) continue;

      const itemTotal = parseFloat(product.price as unknown as string) * quantity;
      totalAmount += itemTotal;

      line_items.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: product.title,
            images: product.image1 ? [product.image1] : [],
          },
          unit_amount: Math.round(parseFloat(product.price as unknown as string) * 100),
        },
        quantity,
      });
    }

    // Add shipping for US addresses
    const shippingCost = 100; // $100 shipping for US
    line_items.push({
      price_data: {
        currency: 'usd',
        product_data: {
          name: 'Shipping (US)',
          description: 'Standard shipping within the United States',
        },
        unit_amount: shippingCost * 100, // Convert to cents
      },
      quantity: 1,
    });
    totalAmount += shippingCost;

    // Create order in database first with PENDING status
    const [newOrder] = await db.insert(orders).values({
      userId: dbUser.id,
      total: totalAmount.toFixed(2),
      status: 'PENDING', // Will be updated to PAID by webhook after successful payment
    }).returning();

    // Create order items
    for (const item of cartItems) {
      const productId = item.productId as string | undefined;
      const quantity = Number(item.quantity) || 1;
      if (!productId) continue;

      const product = await db.query.products.findFirst({ where: eq(products.id, productId) });
      if (!product) continue;

      await db.insert(orderItems).values({
        orderId: newOrder.id,
        productId,
        quantity,
        price: product.price,
      });
    }

    // Don't clear cart here - only clear after successful payment

    if (line_items.length === 0) {
      return NextResponse.json({ error: 'No valid products in cart' }, { status: 400 });
    }

    const origin = request.headers.get('origin') ?? process.env.NEXT_PUBLIC_APP_URL ?? '';

    // Create Stripe Checkout Session
    const sessionConfig: any = {
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cart?canceled=true`,
      payment_intent_data: {
        metadata: {
          orderId: newOrder.id,
        },
        currency: 'usd', // Force USD at payment intent level
      },
      metadata: {
        orderId: newOrder.id,
      },
      locale: 'en',
      billing_address_collection: 'required',
      customer_creation: 'always',
      // Force USD by not allowing currency conversion
      allow_promotion_codes: false,
      automatic_tax: { enabled: false },
    };

    // If shipping info is provided, pre-fill it; otherwise collect it
    if (shippingInfo) {
      sessionConfig.customer_email = shippingInfo.email;
      sessionConfig.shipping_options = [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: {
              amount: 10000, // $100 in cents
              currency: 'usd',
            },
            display_name: 'Standard Shipping (US)',
            delivery_estimate: {
              minimum: {
                unit: 'business_day',
                value: 5,
              },
              maximum: {
                unit: 'business_day',
                value: 10,
              },
            },
          },
        },
      ];
      // Don't set shipping_address_collection when we have shipping info
    } else {
      sessionConfig.shipping_address_collection = {
        allowed_countries: ['US'],
      };
    }

    const session = await stripe.checkout.sessions.create(sessionConfig);

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
