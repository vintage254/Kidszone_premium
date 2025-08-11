import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { stripe } from '@/lib/stripe';
import { db } from '@/database/drizzle';
import { orders } from '@/database/schema';
import { eq } from 'drizzle-orm';

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

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session?.metadata?.orderId;

    if (!orderId) {
      console.error('Webhook Error: Missing orderId in session metadata');
      return new NextResponse('Webhook Error: Missing orderId', { status: 400 });
    }

    try {
      await db
        .update(orders)
        .set({ status: 'PAID' })
        .where(eq(orders.id, orderId));
      
      console.log(`Order ${orderId} has been marked as PAID.`);
    } catch (dbError) {
      console.error(`Database Error: Failed to update order ${orderId}`, dbError);
      return new NextResponse('Database Error', { status: 500 });
    }
  } else if (event.type === 'checkout.session.expired') {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session?.metadata?.orderId;

    if (!orderId) {
      console.error('Webhook Error: Missing orderId in expired session metadata');
      return new NextResponse('Webhook Error: Missing orderId', { status: 400 });
    }

    try {
      await db
        .update(orders)
        .set({ status: 'FAILED' })
        .where(eq(orders.id, orderId));
      
      console.log(`Order ${orderId} has been marked as FAILED (session expired).`);
    } catch (dbError) {
      console.error(`Database Error: Failed to update order ${orderId}`, dbError);
      return new NextResponse('Database Error', { status: 500 });
    }
  } else if (event.type === 'payment_intent.payment_failed') {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    const orderId = paymentIntent?.metadata?.orderId;

    if (!orderId) {
      console.error('Webhook Error: Missing orderId in payment intent metadata');
      return new NextResponse('Webhook Error: Missing orderId', { status: 400 });
    }

    try {
      await db
        .update(orders)
        .set({ status: 'FAILED' })
        .where(eq(orders.id, orderId));
      
      console.log(`Order ${orderId} has been marked as FAILED (payment failed).`);
    } catch (dbError) {
      console.error(`Database Error: Failed to update order ${orderId}`, dbError);
      return new NextResponse('Database Error', { status: 500 });
    }
  }

  return new NextResponse(null, { status: 200 });
}
