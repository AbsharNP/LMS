import { CheckCircle, XCircle } from 'lucide-react';

function Toast({ message, tone = 'success' }) {
  if (!message) {
    return null;
  }

  const isError = tone === 'error';
  const Icon = isError ? XCircle : CheckCircle;

  return (
    <div
      className={`fixed right-4 top-4 z-50 flex max-w-sm items-center gap-3 rounded-lg border bg-white px-4 py-3 text-sm shadow-lg ${
        isError
          ? 'border-red-200 text-red-700'
          : 'border-emerald-200 text-emerald-700'
      }`}
      role="status"
    >
      <Icon size={18} />
      <span>{message}</span>
    </div>
  );
}

export default Toast;
