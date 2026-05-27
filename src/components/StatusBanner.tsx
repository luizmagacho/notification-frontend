import { CheckCircle, AlertCircle } from 'lucide-react';

export interface StatusBannerProps {
  status: { type: 'success' | 'error'; text: string } | null;
}

export default function StatusBanner({ status }: StatusBannerProps) {
  if (!status) return null;

  const isSuccess = status.type === 'success';

  return (
    <div
      role="alert"
      className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
        isSuccess
          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
          : 'bg-rose-50 text-rose-700 border border-rose-200'
      }`}
    >
      {isSuccess ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
      <p className="text-sm font-medium">{status.text}</p>
    </div>
  );
}
