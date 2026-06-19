'use client';

import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { OrderTracking } from '@/components/dashboard/order-tracking';
import { OrderReviewForm } from '@/components/dashboard/order-review-form';
import { OrderRevisionForm } from '@/components/dashboard/order-revision-form';
import { getStatusBadge } from '@/types/dashboard';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        const response = await axios.get(`/api/orders/${orderId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrder(response.data.order);
        setReviewSubmitted(response.data.order.reviews?.length > 0);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load order');
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="text-center py-8">Loading order...</div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </DashboardLayout>
    );
  }

  if (!order) {
    return (
      <DashboardLayout>
        <div className="text-center py-8">Order not found</div>
      </DashboardLayout>
    );
  }

  const statusBadge = getStatusBadge(order.status);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <Link href="/dashboard" className="text-primary hover:underline text-sm mb-4 inline-block">
              ← Back to Dashboard
            </Link>
            <h1 className="text-4xl font-bold text-dark mb-2">{order.topic}</h1>
            <p className="text-gray-600">Order #{order.orderNumber}</p>
          </div>
          <span className={`px-4 py-2 rounded-full font-medium ${statusBadge.bgColor} ${statusBadge.color}`}>
            {statusBadge.label}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="col-span-2 space-y-8">
            {/* Order Details */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold text-dark mb-6">Order Details</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Paper Type</p>
                  <p className="font-medium text-gray-900">{order.paperType}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Academic Level</p>
                  <p className="font-medium text-gray-900">{order.academicLevel}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Word Count</p>
                  <p className="font-medium text-gray-900">{order.wordCount} words</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Citation Style</p>
                  <p className="font-medium text-gray-900">{order.citationStyle.toUpperCase()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Deadline</p>
                  <p className="font-medium text-gray-900">{new Date(order.deadline).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Price</p>
                  <p className="font-medium text-gray-900">${order.finalPrice.toFixed(2)}</p>
                </div>
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold text-dark mb-4">Instructions</h2>
              <p className="text-gray-700 whitespace-pre-wrap">{order.instructions}</p>
            </div>

            {/* Progress Tracking */}
            <OrderTracking orderId={orderId} />

            {/* Review Section */}
            {order.status === 'COMPLETED' && !reviewSubmitted && (
              <OrderReviewForm orderId={orderId} onSuccess={() => setReviewSubmitted(true)} />
            )}

            {/* Revision Section */}
            {order.status === 'COMPLETED' && (
              <OrderRevisionForm orderId={orderId} onSuccess={() => {}} />
            )}
          </div>

          {/* Sidebar */}
          <div className="col-span-1 space-y-6">
            {/* Download Essay */}
            {order.submittedEssay && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="font-bold text-dark mb-4">Download Essay</h3>
                <a
                  href={order.submittedEssay.fileUrl}
                  download
                  className="w-full inline-block text-center bg-primary text-white py-2 rounded hover:bg-blue-700 transition font-medium"
                >
                  📥 Download
                </a>
              </div>
            )}

            {/* Writer Info */}
            {order.writer && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="font-bold text-dark mb-4">Assigned Writer</h3>
                <div className="space-y-2">
                  <p className="font-medium text-gray-900">{order.writer.firstName} {order.writer.lastName}</p>
                  <p className="text-sm text-gray-600">{order.writer.email}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
