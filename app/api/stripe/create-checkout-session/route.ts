import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getUserByClerkId } from '@/lib/services/user.service';
import { db } from '@/database/drizzle';
import { orders, orderItems, products, cart } from '@/database/schema';
import { eq } from 'drizzle-orm';
import { stripe } from '@/lib/stripe';

export async function POST(request: NextRequest) {
  try {
    const { cartItems } = await request.json();

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

    // Create single order for all items
    const [newOrder] = await db.insert(orders).values({
      userId: dbUser.id,
      total: totalAmount.toFixed(2),
      status: 'PAID',
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

    // Clear user's cart after creating the order
    await db.delete(cart).where(eq(cart.userId, dbUser.id));

    if (line_items.length === 0) {
      return NextResponse.json({ error: 'No valid products in cart' }, { status: 400 });
    }

    const origin = request.headers.get('origin') ?? process.env.NEXT_PUBLIC_APP_URL ?? '';

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout?canceled=true`,
      shipping_address_collection: {
        allowed_countries: ['US', 'CA'],
      },
      payment_intent_data: {
        metadata: {
          orderId: newOrder.id,
        },
      },
      metadata: {
        orderId: newOrder.id,
      },
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
