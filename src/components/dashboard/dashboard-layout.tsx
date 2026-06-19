'use client';

import { useAuth } from '@/context/auth-context';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <div className="flex h-screen bg-light">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-dark text-white transition-all duration-300 flex flex-col`}>
        {/* Logo */}
        <div className="p-6 border-b border-gray-700">
          <Link href="/" className="font-bold text-xl">
            {sidebarOpen ? 'Essay Writer' : 'EW'}
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          <Link
            href="/dashboard"
            className="flex items-center p-3 rounded hover:bg-gray-700 transition"
          >
            <span className="text-2xl">📊</span>
            {sidebarOpen && <span className="ml-3">Dashboard</span>}
          </Link>
          <Link
            href="/order"
            className="flex items-center p-3 rounded hover:bg-gray-700 transition"
          >
            <span className="text-2xl">➕</span>
            {sidebarOpen && <span className="ml-3">New Order</span>}
          </Link>
          <Link
            href="/dashboard/orders"
            className="flex items-center p-3 rounded hover:bg-gray-700 transition"
          >
            <span className="text-2xl">📋</span>
            {sidebarOpen && <span className="ml-3">My Orders</span>}
          </Link>
          <Link
            href="/dashboard/settings"
            className="flex items-center p-3 rounded hover:bg-gray-700 transition"
          >
            <span className="text-2xl">⚙️</span>
            {sidebarOpen && <span className="ml-3">Settings</span>}
          </Link>
        </nav>

        {/* User Info */}
        <div className="p-4 border-t border-gray-700 space-y-2">
          {sidebarOpen && (
            <div className="text-sm">
              <p className="font-medium">{user?.firstName || 'User'}</p>
              <p className="text-gray-400 text-xs">{user?.email}</p>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center p-2 text-sm rounded hover:bg-gray-700 transition"
          >
            <span>🚪</span>
            {sidebarOpen && <span className="ml-2">Logout</span>}
          </button>
        </div>

        {/* Toggle Button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-3 hover:bg-gray-700 transition border-t border-gray-700 text-center"
        >
          {sidebarOpen ? '◀' : '▶'}
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
