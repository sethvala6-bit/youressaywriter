import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-04-10',
});

export async function createCheckoutSession({
  orderId,
  totalPrice,
  customerEmail,
}: {
  orderId: string;
  totalPrice: number;
  customerEmail: string;
}) {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Essay Writing Order',
            description: `Order ID: ${orderId}`,
          },
          unit_amount: Math.round(totalPrice * 100),
        },
        quantity: 1,
      },
    ],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?payment=success`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/order/payment?canceled=true`,
    customer_email: customerEmail,
    metadata: {
      orderId,
    },
  });

  return session;
}
