import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "./apiClient";
import toast from "react-hot-toast";

export const useUserDetail = (identifier) => {
  return useQuery({
    queryKey: ["user", identifier],
    queryFn: () => apiClient.get(`/api/users/${identifier}`),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: true,
    enabled: !!identifier,
  });
};

export const useUserSuggestions = (identifier) => {
  return useQuery({
    queryKey: ["suggestions", identifier],
    queryFn: () =>
      apiClient.get(`/api/users/suggestions`, {
        identifier: identifier,
      }),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: true,
    enabled: !!identifier,
  });
};

export const useFollowUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId) => apiClient.post(`/api/follow/${userId}`),
    onSuccess: (data, userId) => {
      queryClient.invalidateQueries({ queryKey: ["suggestions"] });
      queryClient.invalidateQueries({ queryKey: ["user", userId] });

      toast.success("You just followed this person");
    },
    onError: (error, userId) => {
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.response?.statusText ||
        error.message ||
        "Failed to follow user";

      toast.error(errorMessage);
    },
  });
};

export const useUnfollowUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId) => apiClient.delete(`/api/follow/${userId}`),
    onSuccess: (data, userId) => {
      queryClient.invalidateQueries({ queryKey: ["suggestions"] });
      queryClient.invalidateQueries({ queryKey: ["user", userId] });
    },
  });
};
