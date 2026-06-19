'use client';

import { useMemo } from 'react';

interface OrderStatsProps {
  orders: any[];
}

export function OrderStats({ orders }: OrderStatsProps) {
  const stats = useMemo(() => {
    return {
      total: orders.length,
      completed: orders.filter((o) => o.status === 'COMPLETED').length,
      inProgress: orders.filter((o) => ['WRITING', 'REVIEWING'].includes(o.status)).length,
      pending: orders.filter((o) => ['PENDING', 'PAYMENT', 'ASSIGNING'].includes(o.status)).length,
      averageRating:
        orders
          .filter((o) => o.reviews && o.reviews.length > 0)
          .reduce((sum, o) => sum + (o.reviews[0]?.rating || 0), 0) /
          Math.max(
            orders.filter((o) => o.reviews && o.reviews.length > 0).length,
            1
          ),
    };
  }, [orders]);

  return (
    <div className="grid grid-cols-4 gap-4 mb-8">
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600 text-sm mb-2">Total Orders</p>
        <p className="text-3xl font-bold text-dark">{stats.total}</p>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600 text-sm mb-2">Completed</p>
        <p className="text-3xl font-bold text-green-600">{stats.completed}</p>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600 text-sm mb-2">In Progress</p>
        <p className="text-3xl font-bold text-blue-600">{stats.inProgress}</p>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600 text-sm mb-2">Average Rating</p>
        <p className="text-3xl font-bold text-yellow-600">{stats.averageRating.toFixed(1)}⭐</p>
      </div>
    </div>
  );
}
