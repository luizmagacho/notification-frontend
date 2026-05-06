'use client';

import { useState, useEffect } from 'react';
import { api, Category, NotificationLog } from '@/lib/api';
import { Send, History, Bell, Mail, Smartphone, Monitor, Info, CheckCircle, AlertCircle } from 'lucide-react';

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [history, setHistory] = useState<NotificationLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState<Category | ''>('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const fetchData = async () => {
    try {
      const [cats, hist] = await Promise.all([api.getCategories(), api.getHistory()]);
      setCategories(cats);
      setHistory(hist);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000); // Poll every 5s
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!category || !message.trim()) return;

    setLoading(true);
    setStatus(null);
    try {
      const res = await api.sendNotification(category as Category, message);
      if (res.error) {
        setStatus({ type: 'error', text: res.error });
      } else {
        setStatus({ type: 'success', text: res.message || 'Notification sent!' });
        setMessage('');
        setCategory('');
        fetchData();
      }
    } catch (err) {
      setStatus({ type: 'error', text: 'Failed to connect to the server' });
    } finally {
      setLoading(false);
    }
  };

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'EMAIL': return <Mail className="w-4 h-4" />;
      case 'SMS': return <Smartphone className="w-4 h-4" />;
      case 'PUSH': return <Monitor className="w-4 h-4" />;
      default: return <Bell className="w-4 h-4" />;
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight flex items-center justify-center gap-3">
            <Bell className="text-indigo-600 w-10 h-10" />
            Notification System
          </h1>
          <p className="mt-3 text-lg text-slate-600">
            Send messages to subscribed users across multiple channels.
          </p>
        </div>

        {/* Submission Form */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          <div className="bg-indigo-600 px-6 py-4 flex items-center gap-2">
            <Send className="text-white w-5 h-5" />
            <h2 className="text-lg font-semibold text-white">Send Notification</h2>
          </div>
          <div className="p-6">
            {status && (
              <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${status.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'}`}>
                {status.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                <p className="text-sm font-medium">{status.text}</p>
              </div>
            )}

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

        {/* History Log */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          <div className="bg-slate-900 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <History className="text-white w-5 h-5" />
              <h2 className="text-lg font-semibold text-white">Transmission Logs</h2>
            </div>
            <span className="bg-indigo-500 text-white text-xs font-bold px-3 py-1 rounded-full">
              {history.length} Entries
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Timestamp</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Recipient</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Channel</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Message</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {history.length > 0 ? history.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 tabular-nums">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-slate-900">{log.userName}</div>
                      <div className="text-xs text-slate-500">{log.userEmail}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800">
                        {log.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 text-sm text-slate-600 font-medium capitalize">
                        {getChannelIcon(log.channel)}
                        {log.channel.toLowerCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 max-w-xs truncate">
                      {log.message}
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-400 italic">
                      <div className="flex flex-col items-center gap-2">
                        <Info className="w-8 h-8 opacity-20" />
                        No notification history recorded yet.
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
