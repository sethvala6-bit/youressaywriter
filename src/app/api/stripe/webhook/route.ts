import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-04-10',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        { message: 'Missing signature' },
        { status: 400 }
      );
    }

    // Verify webhook signature
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
      return NextResponse.json(
        { message: `Webhook Error: ${err.message}` },
        { status: 400 }
      );
    }

    // Handle payment intent events
    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      const orderId = paymentIntent.metadata?.orderId;

      if (orderId) {
        // Update order status
        await prisma.order.update({
          where: { id: orderId },
          data: {
            status: 'ASSIGNING',
            paymentStatus: 'SUCCESS',
            paymentIntentId: paymentIntent.id,
          },
        });

        // TODO: Send confirmation email
        // TODO: Notify writer pool via Socket.io
        console.log(`Order ${orderId} payment confirmed`);
      }
    }

    if (event.type === 'payment_intent.payment_failed') {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      const orderId = paymentIntent.metadata?.orderId;

      if (orderId) {
        // Update order status
        await prisma.order.update({
          where: { id: orderId },
          data: {
            paymentStatus: 'FAILED',
          },
        });

        console.log(`Order ${orderId} payment failed`);
      }
    }

    return NextResponse.json(
      { received: true },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { message: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
