'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { getStatusBadge } from '@/types/dashboard';

const statusSteps = ['PENDING', 'PAYMENT', 'ASSIGNING', 'WRITING', 'REVIEWING', 'COMPLETED'];

interface OrderTrackingProps {
  orderId: string;
}

export function OrderTracking({ orderId }: OrderTrackingProps) {
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        const response = await axios.get(`/api/orders/${orderId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrder(response.data.order);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error) return <div className="text-red-600">Error: {error}</div>;
  if (!order) return <div className="text-center py-8">Order not found</div>;

  const currentStepIndex = statusSteps.indexOf(order.status);
  const progress = ((currentStepIndex + 1) / statusSteps.length) * 100;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold text-dark mb-6">Order Progress</h2>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          <span className="text-sm text-gray-600">Overall Progress</span>
          <span className="text-sm font-bold text-primary">{Math.round(progress)}%</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-primary transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Timeline */}
      <div className="space-y-4">
        {statusSteps.map((step, index) => {
          const isCompleted = index <= currentStepIndex;
          const isCurrent = index === currentStepIndex;
          const badge = getStatusBadge(step);

          return (
            <div key={step} className="flex items-center">
              <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full border-2 transition"
                style={{
                  borderColor: isCompleted ? '#3B82F6' : '#D1D5DB',
                  backgroundColor: isCompleted ? '#3B82F6' : 'white',
                }}
              >
                {isCompleted && <span className="text-white text-sm">✓</span>}
              </div>
              <div className="ml-4 flex-1">
                <p className={`text-sm font-medium ${
                  isCompleted ? 'text-gray-900' : 'text-gray-500'
                }`}>
                  {badge.label}
                </p>
              </div>
              {isCurrent && (
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                  In Progress
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Writer Info */}
      {order.writer && (
        <div className="mt-8 pt-6 border-t">
          <h3 className="font-semibold text-dark mb-3">Assigned Writer</h3>
          <div className="bg-gray-50 p-4 rounded">
            <p className="font-medium text-gray-900">{order.writer.firstName} {order.writer.lastName}</p>
            <p className="text-sm text-gray-600">{order.writer.email}</p>
          </div>
        </div>
      )}
    </div>
  );
}
