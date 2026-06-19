'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { PAPER_TYPES, ACADEMIC_LEVELS, CITATION_STYLES } from '@/types/order';
import { calculatePrice } from '@/lib/pricing';

export function OrderPreview() {
  const router = useRouter();
  const [orderData, setOrderData] = useState<any>(null);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const pending = localStorage.getItem('pendingOrder');
    if (!pending) {
      router.push('/order');
      return;
    }
    setOrderData(JSON.parse(pending));
  }, [router]);

  const getLabel = (value: string, options: any[]) => {
    return options.find((opt) => opt.value === value)?.label || value;
  };

  const handleProceedToPayment = async () => {
    if (!agreedToTerms) {
      alert('Please agree to the terms and conditions');
      return;
    }

    setLoading(true);
    try {
      // Proceed to payment
      router.push('/order/payment');
    } finally {
      setLoading(false);
    }
  };

  if (!orderData) {
    return <div className="text-center py-8">Loading...</div>;
  }

  const paperTypeLabel = getLabel(orderData.paperType, PAPER_TYPES);
  const academicLevelLabel = getLabel(orderData.academicLevel, ACADEMIC_LEVELS);
  const citationStyleLabel = getLabel(orderData.citationStyle, CITATION_STYLES);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-dark mb-8">Order Preview</h1>

      <div className="grid grid-cols-3 gap-8">
        {/* Order Details */}
        <div className="col-span-2 space-y-6">
          {/* Basic Info */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-dark mb-4">Order Details</h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Paper Type:</span>
                <span className="font-medium">{paperTypeLabel}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Topic:</span>
                <span className="font-medium">{orderData.topic}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Academic Level:</span>
                <span className="font-medium">{academicLevelLabel}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Citation Style:</span>
                <span className="font-medium">{citationStyleLabel}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Word Count:</span>
                <span className="font-medium">{orderData.wordCount} words ({orderData.pages} pages)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Deadline:</span>
                <span className="font-medium">
                  {new Date(orderData.deadline).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-dark mb-4">Instructions</h2>
            <p className="text-gray-700 whitespace-pre-wrap">{orderData.instructions}</p>
          </div>

          {/* Preferences */}
          {orderData.preferences && Object.values(orderData.preferences).some((v) => v) && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-dark mb-4">Selected Preferences</h2>
              <ul className="space-y-2">
                {orderData.preferences.bestWriter && <li className="text-gray-700">✓ Best Writer Available</li>}
                {orderData.preferences.premiumWriter && <li className="text-gray-700">✓ Premium Writer</li>}
                {orderData.preferences.top10 && <li className="text-gray-700">✓ Top 10 Writer</li>}
                {orderData.preferences.proofreading && <li className="text-gray-700">✓ Proofreading</li>}
                {orderData.preferences.originalityReport && <li className="text-gray-700">✓ Originality Report</li>}
                {orderData.preferences.urgentAssignment && <li className="text-gray-700">✓ Urgent Assignment</li>}
              </ul>
            </div>
          )}

          {/* Attachments */}
          {orderData.fileCount > 0 && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-dark mb-4">Attachments</h2>
              <p className="text-gray-700">{orderData.fileCount} file(s) attached</p>
            </div>
          )}
        </div>

        {/* Pricing Sidebar */}
        <div className="col-span-1">
          <div className="bg-white rounded-lg shadow p-6 sticky top-8">
            <h2 className="text-xl font-bold text-dark mb-6">Order Summary</h2>

            {orderData.pricing && (
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Base Price:</span>
                  <span>${orderData.pricing.basePrice.toFixed(2)}</span>
                </div>

                {orderData.pricing.writerMultiplier > 1 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Writer Premium:</span>
                    <span>+{((orderData.pricing.writerMultiplier - 1) * 100).toFixed(0)}%</span>
                  </div>
                )}

                {orderData.pricing.urgencyMultiplier > 1 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Urgency Premium:</span>
                    <span>+{((orderData.pricing.urgencyMultiplier - 1) * 100).toFixed(0)}%</span>
                  </div>
                )}

                {orderData.pricing.additionalServices > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Additional Services:</span>
                    <span>${orderData.pricing.additionalServices.toFixed(2)}</span>
                  </div>
                )}

                <div className="border-t pt-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal:</span>
                    <span>${orderData.pricing.subtotal.toFixed(2)}</span>
                  </div>

                  {orderData.pricing.discountPercent > 0 && (
                    <div className="flex justify-between text-sm text-green-600 mt-2">
                      <span>Discount ({orderData.pricing.discountPercent}%):</span>
                      <span>-${orderData.pricing.discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                </div>

                <div className="border-t pt-3 flex justify-between">
                  <span className="font-bold text-dark">Total:</span>
                  <span className="text-2xl font-bold text-primary">${orderData.pricing.totalPrice.toFixed(2)}</span>
                </div>
              </div>
            )}

            {/* Terms Checkbox */}
            <label className="flex items-start mb-6">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="w-4 h-4 mt-1 cursor-pointer"
              />
              <span className="ml-3 text-sm text-gray-600">
                I agree to the <Link href="/terms" className="text-primary hover:underline">Terms of Service</Link> and <Link href="/revision-policy" className="text-primary hover:underline">Revision Policy</Link>
              </span>
            </label>

            <button
              onClick={handleProceedToPayment}
              disabled={loading || !agreedToTerms}
              className="w-full bg-primary text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition font-medium"
            >
              {loading ? 'Processing...' : 'Proceed to Payment'}
            </button>

            <button
              onClick={() => router.push('/order')}
              className="w-full bg-gray-200 text-dark py-3 rounded-lg hover:bg-gray-300 transition font-medium mt-3"
            >
              Edit Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
