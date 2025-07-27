import axios from "axios";
import { getSession } from "next-auth/react";

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
      // NextAuth will handle token refresh automatically
      // Just redirect to login if refresh fails
      window.location.href = "/login";
    }

    // for handling other errors
    const errorMessage =
      error.response?.data?.message ||
      error.response?.statusText ||
      error.message ||
      "An error occured";

    return Promise.reject(new Error(errorMessage));
  }
);

export { apiClient };
