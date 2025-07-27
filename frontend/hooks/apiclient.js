import axios from "axios";
import useAuthStore from "@/stores/authStore";

const apiClient = axios.create({
  baseURL: NEXT_PUBLIC_API_URL || "http://localhost:9001",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const { token } = useAuthStore.getState();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
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
  (error) => {
    // for handling 401 error A.K.A Token Expired
    if (error.response?.status === 401) {
      const { logout } = useAuthStore.getState();
      logout();
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
