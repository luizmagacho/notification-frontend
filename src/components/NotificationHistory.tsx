import { NotificationLog } from '@/lib/api';
import { History, Bell, Mail, Smartphone, Monitor, Info } from 'lucide-react';

export interface NotificationHistoryProps {
  history: NotificationLog[];
}

function getChannelIcon(channel: string) {
  switch (channel) {
    case 'EMAIL': return <Mail className="w-4 h-4" />;
    case 'SMS': return <Smartphone className="w-4 h-4" />;
    case 'PUSH': return <Monitor className="w-4 h-4" />;
    default: return <Bell className="w-4 h-4" />;
  }
}

export default function NotificationHistory({ history }: NotificationHistoryProps) {
  return (
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
  );
}
