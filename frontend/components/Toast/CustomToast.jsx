"use client";

import { Toaster, toast } from "react-hot-toast";
import { CheckCircle, XCircle, AlertCircle, Info, X } from "lucide-react";

// Custom toast renderer component
const CustomToast = ({ t, message, type = "default", icon, title }) => {
  const getToastStyles = () => {
    const baseStyles = {
      display: "flex",
      alignItems: "center",
      gap: "12px",
      padding: "16px 20px",
      borderRadius: "12px",
      fontSize: "14px",
      fontWeight: "500",
      boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
      border: "1px solid",
      backdropFilter: "blur(8px)",
      transition: "all 0.3s ease",
      maxWidth: "400px",
      minWidth: "300px",
    };

    const typeStyles = {
      success: {
        background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
        borderColor: "#10b981",
        color: "white",
      },
      error: {
        background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
        borderColor: "#ef4444",
        color: "white",
      },
      warning: {
        background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
        borderColor: "#f59e0b",
        color: "white",
      },
      info: {
        background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
        borderColor: "#3b82f6",
        color: "white",
      },
      default: {
        background: "linear-gradient(135deg, #6b7280 0%, #4b5563 100%)",
        borderColor: "#6b7280",
        color: "white",
      },
    };

    return { ...baseStyles, ...typeStyles[type] };
  };

  const getIcon = () => {
    if (icon) return icon;
    
    const iconSize = 20;
    const iconColor = "currentColor";
    
    switch (type) {
      case "success":
        return <CheckCircle size={iconSize} color={iconColor} />;
      case "error":
        return <XCircle size={iconSize} color={iconColor} />;
      case "warning":
        return <AlertCircle size={iconSize} color={iconColor} />;
      case "info":
        return <Info size={iconSize} color={iconColor} />;
      default:
        return null;
    }
  };

  return (
    <div
      style={{
        ...getToastStyles(),
        opacity: t.visible ? 1 : 0,
        transform: t.visible ? "translateY(0)" : "translateY(-20px)",
      }}
      className="custom-toast"
    >
      {getIcon()}
      <div style={{ flex: 1 }}>
        {title && (
          <div style={{ fontWeight: "600", marginBottom: "4px" }}>
            {title}
          </div>
        )}
        <div>{message}</div>
      </div>
      <button
        onClick={() => toast.dismiss(t.id)}
        style={{
          background: "none",
          border: "none",
          color: "currentColor",
          cursor: "pointer",
          padding: "4px",
          borderRadius: "4px",
          opacity: 0.7,
          transition: "opacity 0.2s ease",
        }}
        onMouseEnter={(e) => (e.target.style.opacity = 1)}
        onMouseLeave={(e) => (e.target.style.opacity = 0.7)}
      >
        <X size={16} />
      </button>
    </div>
  );
};

// Enhanced toast functions
export const customToast = {
  success: (message, options = {}) => {
    return toast.custom(
      (t) => (
        <CustomToast
          t={t}
          message={message}
          type="success"
          title={options.title}
          icon={options.icon}
        />
      ),
      {
        duration: 4000,
        ...options,
      }
    );
  },

  error: (message, options = {}) => {
    return toast.custom(
      (t) => (
        <CustomToast
          t={t}
          message={message}
          type="error"
          title={options.title}
          icon={options.icon}
        />
      ),
      {
        duration: 5000,
        ...options,
      }
    );
  },

  warning: (message, options = {}) => {
    return toast.custom(
      (t) => (
        <CustomToast
          t={t}
          message={message}
          type="warning"
          title={options.title}
          icon={options.icon}
        />
      ),
      {
        duration: 4000,
        ...options,
      }
    );
  },

  info: (message, options = {}) => {
    return toast.custom(
      (t) => (
        <CustomToast
          t={t}
          message={message}
          type="info"
          title={options.title}
          icon={options.icon}
        />
      ),
      {
        duration: 3000,
        ...options,
      }
    );
  },

  loading: (message, options = {}) => {
    return toast.loading(message, {
      style: {
        background: "linear-gradient(135deg, #6b7280 0%, #4b5563 100%)",
        color: "white",
        borderRadius: "12px",
        padding: "16px 20px",
        fontSize: "14px",
        fontWeight: "500",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
        border: "1px solid #6b7280",
        backdropFilter: "blur(8px)",
      },
      ...options,
    });
  },

  custom: (message, options = {}) => {
    return toast.custom(
      (t) => (
        <CustomToast
          t={t}
          message={message}
          type={options.type || "default"}
          title={options.title}
          icon={options.icon}
        />
      ),
      {
        duration: 4000,
        ...options,
      }
    );
  },
};

// Main Toaster component
export default function CustomToaster({ position = "top-right" }) {
  return (
    <Toaster
      position={position}
      toastOptions={{
        duration: 4000,
      }}
      containerStyle={{
        top: 20,
        right: 20,
        bottom: 20,
        left: 20,
      }}
      gutter={8}
    />
  );
}

// Export convenience functions
export const showSuccess = customToast.success;
export const showError = customToast.error;
export const showWarning = customToast.warning;
export const showInfo = customToast.info;
export const showLoading = customToast.loading;
export const showCustom = customToast.custom;
export const dismissToast = toast.dismiss; 
