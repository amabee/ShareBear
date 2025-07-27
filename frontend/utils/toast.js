import toast from "react-hot-toast";

// Custom toast functions with your design
export const showToast = {
  // Success toast
  success: (message, options = {}) => {
    return toast.success(message, {
      duration: 4000,
      ...options,
    });
  },

  // Error toast
  error: (message, options = {}) => {
    return toast.error(message, {
      duration: 5000, // Longer duration for errors
      ...options,
    });
  },

  // Warning toast
  warning: (message, options = {}) => {
    return toast(message, {
      icon: "⚠️",
      duration: 4000,
      style: {
        background: '#f59e0b',
        color: 'white',
        borderRadius: '8px',
        padding: '12px 16px',
        fontSize: '14px',
        fontWeight: '500',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      },
      ...options,
    });
  },

  // Info toast
  info: (message, options = {}) => {
    return toast(message, {
      icon: "ℹ️",
      duration: 3000,
      style: {
        background: '#3b82f6',
        color: 'white',
        borderRadius: '8px',
        padding: '12px 16px',
        fontSize: '14px',
        fontWeight: '500',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      },
      ...options,
    });
  },

  // Loading toast
  loading: (message, options = {}) => {
    return toast.loading(message, {
      style: {
        background: '#6b7280',
        color: 'white',
        borderRadius: '8px',
        padding: '12px 16px',
        fontSize: '14px',
        fontWeight: '500',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      },
      ...options,
    });
  },

  // Custom toast with full control
  custom: (message, options = {}) => {
    return toast(message, {
      duration: 4000,
      style: {
        background: '#374151',
        color: 'white',
        borderRadius: '8px',
        padding: '12px 16px',
        fontSize: '14px',
        fontWeight: '500',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      },
      ...options,
    });
  },
};

// Convenience functions
export const showSuccess = showToast.success;
export const showError = showToast.error;
export const showWarning = showToast.warning;
export const showInfo = showToast.info;
export const showLoading = showToast.loading;

// Dismiss toast
export const dismissToast = toast.dismiss;

// Export the original toast for advanced usage
export { toast }; 
