'use client';

import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { OrderStats } from '@/components/dashboard/order-stats';
import { OrdersTable } from '@/components/dashboard/orders-table';
import { useAuth } from '@/context/auth-context';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

export default function DashboardPage() {
  const { isAuthenticated, user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        const response = await axios.get('/api/orders', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(response.data.orders);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-light flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-dark mb-4">Please Sign In</h1>
          <p className="text-gray-600 mb-6">You need to be logged in to view your dashboard</p>
          <Link href="/signin" className="inline-block bg-primary text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-dark mb-2">Welcome back, {user?.firstName || 'User'}</h1>
          <p className="text-gray-600">Here's an overview of your orders</p>
        </div>

        <OrderStats orders={orders} />

        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-dark">Your Orders</h2>
            <Link href="/order" className="bg-primary text-white px-4 py-2 rounded hover:bg-blue-700 transition text-sm font-medium">
              + New Order
            </Link>
          </div>
          <OrdersTable orders={orders} loading={loading} />
        </div>
      </div>
    </DashboardLayout>
  );
}
