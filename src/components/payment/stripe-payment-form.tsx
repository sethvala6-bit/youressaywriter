'use client';

import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface StripePaymentFormProps {
  orderId: string;
  totalPrice: number;
  onSuccess: () => void;
}

export function StripePaymentForm({ orderId, totalPrice, onSuccess }: StripePaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [invoiceEmail, setInvoiceEmail] = useState(true);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      setError('Payment system not ready');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { error: submitError } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/order/payment/success?orderId=${orderId}`,
        },
        redirect: 'if_required',
      });

      if (submitError) {
        setError(submitError.message || 'Payment failed');
      } else {
        // Payment successful
        onSuccess();
        router.push(`/dashboard?orderId=${orderId}`);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during payment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-dark mb-4">Payment Method</label>
        <div className="bg-white p-4 rounded-lg border border-gray-300">
          <PaymentElement />
        </div>
      </div>

      <label className="flex items-center">
        <input
          type="checkbox"
          checked={invoiceEmail}
          onChange={(e) => setInvoiceEmail(e.target.checked)}
          className="w-4 h-4 rounded border-gray-300 cursor-pointer"
        />
        <span className="ml-2 text-sm text-gray-600">Send invoice to my email</span>
      </label>

      <div className="bg-blue-50 border border-blue-200 p-4 rounded">
        <p className="text-sm text-blue-900">
          <strong>Order ID:</strong> {orderId}
        </p>
        <p className="text-sm text-blue-900 mt-2">
          <strong>Amount:</strong> ${totalPrice.toFixed(2)}
        </p>
      </div>

      <button
        type="submit"
        disabled={loading || !stripe}
        className="w-full bg-primary text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition font-medium"
      >
        {loading ? 'Processing Payment...' : `Pay $${totalPrice.toFixed(2)}`}
      </button>

      <p className="text-xs text-gray-500 text-center">
        Your payment is secure and encrypted. You will not be charged twice.
      </p>
    </form>
  );
}
