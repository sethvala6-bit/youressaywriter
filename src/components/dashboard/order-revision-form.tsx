'use client';

import { useState } from 'react';
import axios from 'axios';

interface OrderRevisionFormProps {
  orderId: string;
  onSuccess: () => void;
}

export function OrderRevisionForm({ orderId, onSuccess }: OrderRevisionFormProps) {
  const [requestText, setRequestText] = useState('');
  const [deadline, setDeadline] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!requestText.trim()) {
      setError('Please describe what needs to be revised');
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('auth_token');
      await axios.post(
        `/api/orders/${orderId}/revision`,
        { requestText, deadline },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to request revision');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-4">
      <h2 className="text-2xl font-bold text-dark mb-6">Request Revision</h2>

      <div className="bg-blue-50 border border-blue-200 p-4 rounded text-sm text-blue-700">
        ℹ️ You have 14 days from delivery to request free revisions
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Revision Request */}
      <div>
        <label className="block text-sm font-medium text-dark mb-2">What needs to be revised? *</label>
        <textarea
          value={requestText}
          onChange={(e) => setRequestText(e.target.value)}
          placeholder="Describe the changes you'd like the writer to make..."
          rows={5}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
        />
      </div>

      {/* Deadline */}
      <div>
        <label className="block text-sm font-medium text-dark mb-2">Revision Deadline (Optional)</label>
        <input
          type="datetime-local"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-primary text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition font-medium"
      >
        {loading ? 'Submitting...' : 'Request Revision'}
      </button>
    </form>
  );
}
