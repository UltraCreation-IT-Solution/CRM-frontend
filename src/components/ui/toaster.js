'use client';

import { createContext, useContext, useState, useCallback } from 'react';
import { clsx } from 'clsx';

// Toast context
const ToastContext = createContext();

// Toast provider component
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((toast) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast = {
      id,
      ...toast,
      createdAt: Date.now(),
    };

    setToasts(prev => [...prev, newToast]);

    // Auto-remove toast after duration (default 5 seconds)
    const duration = toast.duration || 5000;
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }

    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const removeAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  const value = {
    toasts,
    addToast,
    removeToast,
    removeAllToasts,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
    </ToastContext.Provider>
  );
}

// Hook to use toast
export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }

  const { addToast, removeToast, removeAllToasts } = context;

  return {
    toast: addToast,
    dismiss: removeToast,
    dismissAll: removeAllToasts,
    // Convenience methods for different toast types
    success: (message, options = {}) => addToast({ 
      type: 'success', 
      title: 'Success', 
      description: message, 
      ...options 
    }),
    error: (message, options = {}) => addToast({ 
      type: 'error', 
      title: 'Error', 
      description: message, 
      ...options 
    }),
    warning: (message, options = {}) => addToast({ 
      type: 'warning', 
      title: 'Warning', 
      description: message, 
      ...options 
    }),
    info: (message, options = {}) => addToast({ 
      type: 'info', 
      title: 'Info', 
      description: message, 
      ...options 
    }),
    // CRM-specific toast methods
    leadCreated: (leadName, options = {}) => addToast({
      type: 'success',
      title: 'Lead Created',
      description: `${leadName} has been added to your leads`,
      action: {
        label: 'View Lead',
        onClick: options.onView,
      },
      ...options,
    }),
    dealWon: (dealName, amount, options = {}) => addToast({
      type: 'success',
      title: 'Deal Won! 🎉',
      description: `${dealName} closed for $${amount.toLocaleString()}`,
      duration: 8000, // Keep celebration toasts longer
      ...options,
    }),
    taskReminder: (taskTitle, options = {}) => addToast({
      type: 'warning',
      title: 'Task Reminder',
      description: `Don't forget: ${taskTitle}`,
      action: {
        label: 'Mark Done',
        onClick: options.onComplete,
      },
      ...options,
    }),
    newMessage: (from, preview, options = {}) => addToast({
      type: 'info',
      title: `New message from ${from}`,
      description: preview,
      action: {
        label: 'Reply',
        onClick: options.onReply,
      },
      ...options,
    }),
  };
}

// Toast component
function Toast({ toast, onDismiss }) {
  const getToastStyles = (type) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-200';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-200';
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-200';
      default:
        return 'bg-white border-gray-200 text-gray-800 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200';
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircleIcon className="h-5 w-5 text-green-400" />;
      case 'error':
        return <XCircleIcon className="h-5 w-5 text-red-400" />;
      case 'warning':
        return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" />;
      case 'info':
        return <InformationCircleIcon className="h-5 w-5 text-blue-400" />;
      default:
        return <InformationCircleIcon className="h-5 w-5 text-gray-400" />;
    }
  };

  return (
    <div
      className={clsx(
        'pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg border shadow-lg transition-all duration-300',
        'animate-slide-in-right',
        getToastStyles(toast.type)
      )}
    >
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            {getIcon(toast.type)}
          </div>
          <div className="ml-3 w-0 flex-1 pt-0.5">
            {toast.title && (
              <p className="text-sm font-medium">{toast.title}</p>
            )}
            {toast.description && (
              <p className={clsx(
                'text-sm',
                toast.title ? 'mt-1' : '',
                'opacity-90'
              )}>
                {toast.description}
              </p>
            )}
            {toast.action && (
              <div className="mt-3">
                <button
                  className="text-sm font-medium underline hover:no-underline focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-current rounded"
                  onClick={() => {
                    toast.action.onClick?.();
                    onDismiss();
                  }}
                >
                  {toast.action.label}
                </button>
              </div>
            )}
          </div>
          <div className="ml-4 flex flex-shrink-0">
            <button
              className="inline-flex rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-current opacity-70 hover:opacity-100"
              onClick={onDismiss}
            >
              <span className="sr-only">Close</span>
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Toaster component that renders all toasts
export function Toaster() {
  const { toasts, removeToast } = useContext(ToastContext) || { toasts: [], removeToast: () => {} };

  if (!toasts.length) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-50 flex items-end px-4 py-6 sm:items-start sm:p-6"
      aria-live="assertive"
    >
      <div className="flex w-full flex-col items-center space-y-4 sm:items-end">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            toast={toast}
            onDismiss={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </div>
  );
}

// Progress bar component for toasts with duration
function ToastProgressBar({ duration, onComplete }) {
  return (
    <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/10 dark:bg-white/10">
      <div
        className="h-full bg-current opacity-50 transition-all ease-linear"
        style={{
          animation: `toast-progress ${duration}ms linear forwards`,
        }}
      />
      <style jsx>{`
        @keyframes toast-progress {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
}

// CRM-specific toast templates
export const CRMToasts = {
  // Lead management
  leadAdded: (leadName) => ({
    type: 'success',
    title: 'Lead Added',
    description: `${leadName} has been added to your pipeline`,
  }),
  
  leadUpdated: (leadName) => ({
    type: 'info',
    title: 'Lead Updated',
    description: `${leadName}'s information has been updated`,
  }),

  // Deal management
  dealMoved: (dealName, stageName) => ({
    type: 'info',
    title: 'Deal Moved',
    description: `${dealName} moved to ${stageName}`,
  }),

  dealClosed: (dealName, amount) => ({
    type: 'success',
    title: 'Deal Closed! 🎉',
    description: `${dealName} closed for $${amount.toLocaleString()}`,
    duration: 8000,
  }),

  // Activity reminders
  meetingReminder: (title, time) => ({
    type: 'warning',
    title: 'Meeting Reminder',
    description: `${title} starts in ${time}`,
  }),

  callReminder: (contactName) => ({
    type: 'warning',
    title: 'Call Reminder',
    description: `Time to call ${contactName}`,
  }),

  // Communication
  emailSent: (to) => ({
    type: 'success',
    title: 'Email Sent',
    description: `Your email to ${to} has been sent`,
  }),

  whatsappSent: (to) => ({
    type: 'success',
    title: 'WhatsApp Sent',
    description: `Your message to ${to} has been delivered`,
  }),

  // System notifications
  syncComplete: () => ({
    type: 'success',
    title: 'Sync Complete',
    description: 'Your data has been synchronized',
  }),

  syncError: () => ({
    type: 'error',
    title: 'Sync Failed',
    description: 'Failed to synchronize data. Please try again.',
  }),

  // Integration notifications
  integrationConnected: (serviceName) => ({
    type: 'success',
    title: 'Integration Connected',
    description: `${serviceName} has been successfully connected`,
  }),

  integrationDisconnected: (serviceName) => ({
    type: 'warning',
    title: 'Integration Disconnected',
    description: `${serviceName} connection has been lost`,
  }),
};

// Icon components
const CheckCircleIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const XCircleIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ExclamationTriangleIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.348 16.5c-.77.833.192 2.5 1.732 2.5z" />
  </svg>
);

const InformationCircleIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const XMarkIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

export default Toaster;