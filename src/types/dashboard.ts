export interface OrderStats {
  totalOrders: number;
  completedOrders: number;
  inProgressOrders: number;
  pendingOrders: number;
  averageRating: number;
}

export interface OrderStatusBadge {
  status: string;
  label: string;
  color: string;
  bgColor: string;
}

export const ORDER_STATUS_MAP: { [key: string]: OrderStatusBadge } = {
  PENDING: {
    status: 'PENDING',
    label: 'Pending',
    color: 'text-yellow-700',
    bgColor: 'bg-yellow-100',
  },
  PAYMENT: {
    status: 'PAYMENT',
    label: 'Awaiting Payment',
    color: 'text-orange-700',
    bgColor: 'bg-orange-100',
  },
  ASSIGNING: {
    status: 'ASSIGNING',
    label: 'Assigning Writer',
    color: 'text-blue-700',
    bgColor: 'bg-blue-100',
  },
  WRITING: {
    status: 'WRITING',
    label: 'Writing in Progress',
    color: 'text-indigo-700',
    bgColor: 'bg-indigo-100',
  },
  REVIEWING: {
    status: 'REVIEWING',
    label: 'Under Review',
    color: 'text-purple-700',
    bgColor: 'bg-purple-100',
  },
  COMPLETED: {
    status: 'COMPLETED',
    label: 'Completed',
    color: 'text-green-700',
    bgColor: 'bg-green-100',
  },
  REVISION: {
    status: 'REVISION',
    label: 'Revision Requested',
    color: 'text-red-700',
    bgColor: 'bg-red-100',
  },
  CANCELLED: {
    status: 'CANCELLED',
    label: 'Cancelled',
    color: 'text-gray-700',
    bgColor: 'bg-gray-100',
  },
};

export function getStatusBadge(status: string): OrderStatusBadge {
  return ORDER_STATUS_MAP[status] || ORDER_STATUS_MAP['PENDING'];
}

export function getDaysUntilDeadline(deadline: Date): number {
  const now = new Date();
  const deadlineDate = new Date(deadline);
  const diffTime = deadlineDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

export function getDeadlineStatus(deadline: Date): 'urgent' | 'warning' | 'safe' {
  const daysLeft = getDaysUntilDeadline(deadline);
  if (daysLeft <= 1) return 'urgent';
  if (daysLeft <= 3) return 'warning';
  return 'safe';
}
