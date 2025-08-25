import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { db } from '@/database/drizzle';
import { orders, cart, users } from '@/database/schema';
import { eq } from 'drizzle-orm';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = request.headers.get('stripe-signature')!;

  let event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        const orderId = session.metadata?.orderId;

        if (orderId) {
          // Update order status to PAID
          await db
            .update(orders)
            .set({ 
              status: 'PAID',
              stripePaymentIntentId: session.payment_intent as string
            })
            .where(eq(orders.id, orderId));

          // Get the user ID from the order to clear their cart
          const order = await db.query.orders.findFirst({
            where: eq(orders.id, orderId),
          });

          if (order) {
            // Clear user's cart only after successful payment
            await db.delete(cart).where(eq(cart.userId, order.userId));
          }

          console.log(`Payment successful for order ${orderId}`);
        }
        break;

      case 'checkout.session.expired':
        const expiredSession = event.data.object;
        const expiredOrderId = expiredSession.metadata?.orderId;

        if (expiredOrderId) {
          // Update order status to FAILED
          await db
            .update(orders)
            .set({ status: 'FAILED' })
            .where(eq(orders.id, expiredOrderId));

          console.log(`Payment expired for order ${expiredOrderId}`);
        }
        break;

      case 'payment_intent.payment_failed':
        const paymentIntent = event.data.object;
        
        // Find order by payment intent ID and mark as failed
        await db
          .update(orders)
          .set({ status: 'FAILED' })
          .where(eq(orders.stripePaymentIntentId, paymentIntent.id));

        console.log(`Payment failed for payment intent ${paymentIntent.id}`);
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
