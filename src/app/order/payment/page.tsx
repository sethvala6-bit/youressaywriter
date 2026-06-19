import { StripePayment } from '@/components/payment/stripe-payment';
import { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

function PaymentContent() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
        <h2 className="text-2xl font-bold text-dark mb-2">Complete Payment</h2>
        <p className="text-gray-600">Enter your payment details below to complete your order</p>
      </div>

      {/* This will be populated by client component */}
      <div id="payment-container" />
    </div>
  );
}

export default function PaymentPage() {
  return (
    <div className="min-h-screen bg-light py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="mb-8">
          <Link href="/order" className="text-primary hover:underline text-sm mb-4 inline-block">
            ← Back to Order
          </Link>
          <h1 className="text-4xl font-bold text-dark mb-2">Secure Checkout</h1>
          <p className="text-gray-600">All payments are processed securely through Stripe</p>
        </div>

        <Suspense fallback={<div className="text-center py-8">Loading payment form...</div>}>
          <PaymentContent />
        </Suspense>
      </div>
    </div>
  );
}
