import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import useAuthStore from "@/stores/authStore";
import { apiClient } from "./apiclient";

// LOGIN HOOK
export const useLogin = () => {
  const { setAuth } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ usercred, password }) => {
      const response = await axios.post("/auth/login", {
        usercred,
        password,
      });
      return response.data;
    },
    onSuccess: (data) => {
      setAuth(data.user, data.token, data.refreshToken);
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
};

// REGISTRATION HOOK
export const useRegister = () => {
  const { setAuth } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userData) => {
      const response = await axios.post("/auth/register", userData);
      return response.data;
    },
    onSuccess: (data) => {
      setAuth(data.user, data.token);
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
};

// LOGOUT HOOK + UPPERCUT
export const useLogout = () => {
  const { logout } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await apiClient.post("/auth/logout");
    },
    onSuccess: () => {
      logout();
      queryClient.clear(); // to clear the cached queries
    },
  });
};
