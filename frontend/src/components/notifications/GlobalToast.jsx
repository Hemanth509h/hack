import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { removeToast } from '../../features/notifications/notificationSlice';
import { X, CheckCircle, AlertTriangle, Info, XCircle } from 'lucide-react';
import cn from 'clsx';

export const GlobalToast = () => {
  const toasts = useSelector((state) => state.notifications.toastQueue);
  const dispatch = useDispatch();

  return (
    <div className="fixed top-20 right-4 z-50 flex flex-col gap-2 w-80 pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onClose={() => dispatch(removeToast(toast.id))} />
      ))}
    </div>
  );
};

const ToastItem = ({ toast, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, toast.duration || 5000);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-400" />,
    error: <XCircle className="w-5 h-5 text-red-400" />,
    warning: <AlertTriangle className="w-5 h-5 text-yellow-400" />,
    info: <Info className="w-5 h-5 text-blue-400" />
  };

  const bgs = {
    success: 'bg-green-500/10 border-green-500/20',
    error: 'bg-red-500/10 border-red-500/20',
    warning: 'bg-yellow-500/10 border-yellow-500/20',
    info: 'bg-blue-500/10 border-blue-500/20'
  };

  return (
    <div className={cn(
      "pointer-events-auto flex items-start p-4 rounded-lg border backdrop-blur-md shadow-lg transition-all animate-in slide-in-from-right-8 fade-in",
      bgs[toast.type as keyof typeof bgs] || bgs.info
    )}>
      <div className="flex-shrink-0 mt-0.5">
        {icons[toast.type as keyof typeof icons]}
      </div>
      <div className="ml-3 flex-1">
        {toast.title && <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{toast.title}</h3>}
        <p className="text-sm text-gray-700 dark:text-gray-300 mt-0.5">{toast.message}</p>
      </div>
      <button onClick={onClose} className="ml-4 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:text-white transition-colors">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
