import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "./apiclient";

export const usePosts = () => {
  // fetching all posts
  return useQuery({
    queryKey: ["posts"],
    queryFn: () => apiClient.get("/api/posts"),
    staleTime: 1000 * 60 * 5, // stale time is 5 mins
    refetchInterval: 100000, // refetch every 1 min
    refetchOnWindowFocus: true,
  });
};

// fetching a certain post
export const usePost = (postId) => {
  return useQuery({
    queryKey: ["posts", postId],
    queryFn: () => apiClient.get(`/api/posts/${postId}`),
    enabled: !!postId,
  });
};

// creating the post
export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newPost) => apiClient.post("/api/posts", newPost),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
};

// for liking the post
export const useLikePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId) => apiClient.post(`/api/posts/${postId}/like`),
    onSuccess: (data, postId) => {
      // update the specific post in the cache
      queryClient.setQueryData(["posts", postId], data);
      // invalidate the posts list to update the like count
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
};
