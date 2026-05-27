'use client';

import { useState, useEffect, useCallback } from 'react';
import { api, Category, NotificationLog } from '@/lib/api';
import { Bell } from 'lucide-react';
import NotificationForm from '@/components/NotificationForm';
import NotificationHistory from '@/components/NotificationHistory';

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [history, setHistory] = useState<NotificationLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    api.getCategories()
      .then(setCategories)
      .catch((err) => console.error('Failed to fetch categories:', err));
  }, []);

  useEffect(() => {
    api.getHistory()
      .then(setHistory)
      .catch((err) => console.error('Failed to fetch history:', err));

    const cleanup = api.subscribeToHistory(
      (logs) => setHistory(logs),
      () => {
        api.getHistory()
          .then(setHistory)
          .catch((err) => console.error('SSE fallback fetch failed:', err));
      }
    );

    return cleanup;
  }, []);

  const handleSubmit = useCallback(async (category: Category, message: string) => {
    setLoading(true);
    setStatus(null);
    try {
      const res = await api.sendNotification(category, message);
      if (res.error) {
        setStatus({ type: 'error', text: res.error });
      } else {
        setStatus({ type: 'success', text: res.message || 'Notification sent!' });
        api.getHistory().then(setHistory).catch(() => {});
      }
    } catch {
      setStatus({ type: 'error', text: 'Failed to connect to the server' });
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">

        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight flex items-center justify-center gap-3">
            <Bell className="text-indigo-600 w-10 h-10" />
            Notification System
          </h1>
          <p className="mt-3 text-lg text-slate-600">
            Send messages to subscribed users across multiple channels.
          </p>
        </div>

        <NotificationForm
          categories={categories}
          loading={loading}
          status={status}
          onSubmit={handleSubmit}
        />

        <NotificationHistory history={history} />
      </div>
    </main>
  );
}
