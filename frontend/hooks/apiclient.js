import axios from "axios";
import { getSession } from "next-auth/react";
import toast from "react-hot-toast";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:9001",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  async (config) => {
    const session = await getSession();
    
    if (session?.accessToken) {
      config.headers.Authorization = `Bearer ${session.accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  async (error) => {
    // for handling 401 error A.K.A Token Expired
    if (error.response?.status === 401) {
      toast.error("Session expired. Please login again.");
      // NextAuth will handle token refresh automatically
      // Just redirect to login if refresh fails
      window.location.href = "/login";
    }

    // for handling other errors
    const errorMessage =
      error.response?.data?.message ||
      error.response?.statusText ||
      error.message ||
      "An error occurred";

    // Show toast for non-401 errors
    if (error.response?.status !== 401) {
      toast.error(errorMessage);
    }

    return Promise.reject(new Error(errorMessage));
  }
);

export { apiClient };
