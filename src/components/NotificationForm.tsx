'use client';

import { useState } from 'react';
import { Send } from 'lucide-react';
import { Category } from '@/lib/api';
import StatusBanner from './StatusBanner';

export interface NotificationFormProps {
  categories: Category[];
  loading: boolean;
  status: { type: 'success' | 'error'; text: string } | null;
  onSubmit: (category: Category, message: string) => void;
}

export default function NotificationForm({ categories, loading, status, onSubmit }: NotificationFormProps) {
  const [category, setCategory] = useState<Category | ''>('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!category || !message.trim()) return;

    onSubmit(category as Category, message);
    setMessage('');
    setCategory('');
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
      <div className="bg-indigo-600 px-6 py-4 flex items-center gap-2">
        <Send className="text-white w-5 h-5" />
        <h2 className="text-lg font-semibold text-white">Send Notification</h2>
      </div>
      <div className="p-6">
        <StatusBanner status={status} />

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="category" className="block text-sm font-semibold text-slate-700 mb-2">
                Category
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                className="block w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-slate-900"
                required
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-semibold text-slate-700 mb-2">
              Message
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="block w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-slate-900 resize-none"
              placeholder="Enter the notification content..."
              required
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center gap-2 py-4 px-6 border border-transparent rounded-xl shadow-lg text-lg font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
          >
            {loading ? 'Sending...' : 'Dispatch Notifications'}
            {!loading && <Send className="w-5 h-5" />}
          </button>
        </form>
      </div>
    </div>
  );
}
