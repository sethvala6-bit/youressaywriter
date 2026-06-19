'use client';

import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { StripePaymentForm } from './stripe-payment-form';
import { useState, useEffect } from 'react';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

export interface StripePaymentProps {
  orderId: string;
  totalPrice: number;
  customerEmail: string;
  onSuccess: () => void;
}

export function StripePayment({ orderId, totalPrice, customerEmail, onSuccess }: StripePaymentProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const createCheckoutSession = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('/api/stripe/create-checkout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            orderId,
            totalPrice,
            customerEmail,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to create payment session');
        }

        const data = await response.json();
        setClientSecret(data.clientSecret);
      } catch (err: any) {
        setError(err.message || 'Failed to initialize payment');
      } finally {
        setLoading(false);
      }
    };

    createCheckoutSession();
  }, [orderId, totalPrice, customerEmail]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Initializing payment...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        <p className="font-medium">Payment Error</p>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  if (!clientSecret) {
    return null;
  }

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <StripePaymentForm orderId={orderId} totalPrice={totalPrice} onSuccess={onSuccess} />
    </Elements>
  );
}
