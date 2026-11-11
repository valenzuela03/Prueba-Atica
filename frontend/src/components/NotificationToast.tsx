import React, { useEffect } from 'react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error';
  text: string;
}

interface NotificationToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({
  toasts,
  onDismiss,
}) => {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
};

const ToastItem: React.FC<{
  toast: ToastMessage;
  onDismiss: (id: string) => void;
}> = ({ toast, onDismiss }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  const isSuccess = toast.type === 'success';

  return (
    <div
      className={`pointer-events-auto p-3.5 rounded-xl border shadow-lg flex items-center gap-2.5 transition-all ${
        isSuccess
          ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
          : 'bg-rose-50 border-rose-200 text-rose-900'
      }`}
    >
      <span className="font-bold text-sm">
        {isSuccess ? '✓' : '!'}
      </span>
      <p className="text-xs font-medium flex-1">{toast.text}</p>
      <button
        onClick={() => onDismiss(toast.id)}
        className="text-xs font-bold px-1 text-slate-500 hover:text-slate-800 transition-colors"
      >
        ✕
      </button>
    </div>
  );
};
