"use client";

import { Toaster } from "react-hot-toast";

const toastStyles = {
  success: {
    style: {
      background: "#10b981",
      color: "white",
      borderRadius: "8px",
      padding: "12px 16px",
      fontSize: "14px",
      fontWeight: "500",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
    },
    iconTheme: {
      primary: "white",
      secondary: "#10b981",
    },
  },
  error: {
    style: {
      background: "#ef4444",
      color: "white",
      borderRadius: "8px",
      padding: "12px 16px",
      fontSize: "14px",
      fontWeight: "500",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
    },
    iconTheme: {
      primary: "white",
      secondary: "#ef4444",
    },
  },
  warning: {
    style: {
      background: "#f59e0b",
      color: "white",
      borderRadius: "8px",
      padding: "12px 16px",
      fontSize: "14px",
      fontWeight: "500",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
    },
    iconTheme: {
      primary: "white",
      secondary: "#f59e0b",
    },
  },
  info: {
    style: {
      background: "#3b82f6",
      color: "white",
      borderRadius: "8px",
      padding: "12px 16px",
      fontSize: "14px",
      fontWeight: "500",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
    },
    iconTheme: {
      primary: "white",
      secondary: "#3b82f6",
    },
  },
};

export default function CustomToaster() {
  return (
    <Toaster
      position= "bottom-left"
      toastOptions={{
        duration: 4000,
        ...toastStyles,
      }}
    />
  );
}
