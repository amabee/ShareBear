import { useSession, signIn, signOut } from "next-auth/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "./apiclient";
import useUserStore from "@/stores/userStore";

// NextAuth session hook
export const useAuth = () => {
  const { data: session, status, update } = useSession();
  
  return {
    user: session?.user,
    isAuthenticated: !!session?.user,
    isLoading: status === "loading",
    session,
    update,
  };
};

// Login hook using NextAuth
export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ usercred, password }) => {
      const result = await signIn("credentials", {
        usercred,
        password,
        redirect: false,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
};

// Register hook with auto-login
export const useRegister = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userData) => {
      // Call our NextAuth register endpoint
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Registration failed");
      }

      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
};

// Logout hook using NextAuth
export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      // Call your backend logout endpoint
      await apiClient.post("/auth/logout");
      // Then sign out from NextAuth
      await signOut({ redirect: false });
    },
    onSuccess: () => {
      queryClient.clear();
      // Clear user store data
      const { clearUserData } = useUserStore.getState();
      clearUserData();
    },
  });
}; 
