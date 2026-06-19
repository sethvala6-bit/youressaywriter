'use client';

import Link from 'next/link';
import { getStatusBadge, getDaysUntilDeadline } from '@/types/dashboard';

interface OrderCardProps {
  order: any;
}

export function OrderCard({ order }: OrderCardProps) {
  const statusBadge = getStatusBadge(order.status);
  const daysLeft = getDaysUntilDeadline(order.deadline);

  return (
    <div className="bg-white rounded-lg shadow hover:shadow-lg transition p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-dark">{order.topic}</h3>
          <p className="text-sm text-gray-600 font-mono">{order.orderNumber}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusBadge.bgColor} ${statusBadge.color}`}>
          {statusBadge.label}
        </span>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Paper Type:</span>
          <span className="font-medium text-gray-900">{order.paperType}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Words:</span>
          <span className="font-medium text-gray-900">{order.wordCount}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Deadline:</span>
          <span className={`font-medium ${
            daysLeft <= 1 ? 'text-red-600' : daysLeft <= 3 ? 'text-orange-600' : 'text-green-600'
          }`}>
            {daysLeft > 0 ? `${daysLeft} days left` : 'Overdue'}
          </span>
        </div>
      </div>

      <div className="border-t pt-4">
        <p className="text-lg font-bold text-dark mb-4">${order.finalPrice.toFixed(2)}</p>
        <Link href={`/dashboard/order/${order.id}`} className="w-full inline-block text-center bg-primary text-white py-2 rounded hover:bg-blue-700 transition font-medium text-sm">
          View Details
        </Link>
      </div>
    </div>
  );
}
