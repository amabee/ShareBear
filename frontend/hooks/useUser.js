import { useQuery } from "@tanstack/react-query";
import { apiClient } from "./apiClient";

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
