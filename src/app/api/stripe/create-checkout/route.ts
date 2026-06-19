import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

export async function POST(request: NextRequest) {
  try {
    const { orderId, totalPrice, customerEmail } = await request.json();

    if (!orderId || !totalPrice || !customerEmail) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalPrice * 100), // Convert to cents
      currency: 'usd',
      metadata: {
        orderId,
      },
      receipt_email: customerEmail,
    });

    return NextResponse.json(
      {
        success: true,
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Create checkout error:', error);
    return NextResponse.json(
      { message: error.message || 'Failed to create payment' },
      { status: 500 }
    );
  }
}
