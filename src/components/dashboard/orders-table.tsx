'use client';

import Link from 'next/link';
import { getStatusBadge, getDaysUntilDeadline } from '@/types/dashboard';

interface OrdersTableProps {
  orders: any[];
  loading?: boolean;
}

export function OrdersTable({ orders, loading }: OrdersTableProps) {
  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p>Loading orders...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow">
        <p className="text-gray-600 text-lg mb-4">No orders yet</p>
        <Link href="/order" className="text-primary hover:underline font-medium">
          Place your first order
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Order ID</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Topic</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Deadline</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Price</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {orders.map((order) => {
            const statusBadge = getStatusBadge(order.status);
            const daysLeft = getDaysUntilDeadline(order.deadline);

            return (
              <tr key={order.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 text-sm font-mono text-gray-600">
                  {order.orderNumber?.slice(0, 8)}...
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  <div className="max-w-xs truncate">{order.topic}</div>
                </td>
                <td className="px-6 py-4 text-sm">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusBadge.bgColor} ${statusBadge.color}`}>
                    {statusBadge.label}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">
                  <div className="text-gray-900">{new Date(order.deadline).toLocaleDateString()}</div>
                  <div className={`text-xs mt-1 ${
                    daysLeft <= 1 ? 'text-red-600' : daysLeft <= 3 ? 'text-orange-600' : 'text-green-600'
                  }`}>
                    {daysLeft > 0 ? `${daysLeft} days left` : 'Overdue'}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                  ${order.finalPrice.toFixed(2)}
                </td>
                <td className="px-6 py-4 text-sm">
                  <Link href={`/dashboard/order/${order.id}`} className="text-primary hover:underline font-medium">
                    View
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
