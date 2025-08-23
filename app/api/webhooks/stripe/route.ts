import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { stripe } from '@/lib/stripe';
import { db } from '@/database/drizzle';
import { cart, orders } from '@/database/schema';
import { eq, inArray } from 'drizzle-orm';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('Stripe-Signature') as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  // Helper to parse array of order IDs from metadata
  const parseOrderIds = (meta?: Record<string, string | undefined> | null): string[] => {
    const raw = meta?.orderIds ?? meta?.orderId;
    if (!raw) return [];
    try {
      // If it's a JSON array string
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed.filter(Boolean);
    } catch (_) {
      // Fallback: treat as single ID string
      return [raw];
    }
    // Fallback if parsed is not array
    return [raw];
  };

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderIds = parseOrderIds(session?.metadata);

    if (!orderIds.length) {
      console.error('Webhook Error: Missing orderIds in session metadata');
      return new NextResponse('Webhook Error: Missing orderIds', { status: 400 });
    }

    try {
      await db
        .update(orders)
        .set({ status: 'PAID' })
        .where(inArray(orders.id, orderIds));
      
      console.log(`Orders [${orderIds.join(', ')}] marked as PAID.`);

      // Also clear the user's cart for these orders (in case it wasn't cleared earlier)
      const owningOrders = await db
        .select({ userId: orders.userId })
        .from(orders)
        .where(inArray(orders.id, orderIds));

      const userIds = Array.from(new Set(owningOrders.map(o => o.userId).filter(Boolean)));
      if (userIds.length > 0) {
        await db.delete(cart).where(inArray(cart.userId, userIds as string[]));
        console.log(`Cleared cart for users [${userIds.join(', ')}] after payment success.`);
      }
    } catch (dbError) {
      console.error(`Database Error: Failed to update orders [${orderIds.join(', ')}]`, dbError);
      return new NextResponse('Database Error', { status: 500 });
    }
  } else if (event.type === 'checkout.session.expired') {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderIds = parseOrderIds(session?.metadata);

    if (!orderIds.length) {
      console.error('Webhook Error: Missing orderIds in expired session metadata');
      return new NextResponse('Webhook Error: Missing orderIds', { status: 400 });
    }

    try {
      await db
        .update(orders)
        .set({ status: 'FAILED' })
        .where(inArray(orders.id, orderIds));
      
      console.log(`Orders [${orderIds.join(', ')}] marked as FAILED (session expired).`);
    } catch (dbError) {
      console.error(`Database Error: Failed to update orders [${orderIds.join(', ')}]`, dbError);
      return new NextResponse('Database Error', { status: 500 });
    }
  } else if (event.type === 'payment_intent.payment_failed') {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    const orderIds = parseOrderIds(paymentIntent?.metadata as any);

    if (!orderIds.length) {
      console.warn('Payment failed event without orderIds metadata. Ignoring.');
      return new NextResponse(null, { status: 200 });
    }

    try {
      await db
        .update(orders)
        .set({ status: 'FAILED' })
        .where(inArray(orders.id, orderIds));
      
      console.log(`Orders [${orderIds.join(', ')}] marked as FAILED (payment failed).`);
    } catch (dbError) {
      console.error(`Database Error: Failed to update orders [${orderIds.join(', ')}]`, dbError);
      return new NextResponse('Database Error', { status: 500 });
    }
  }

  return new NextResponse(null, { status: 200 });
}
