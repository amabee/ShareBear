import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";
import { apiClient } from "./apiclient";
import { useCreatePostStore, ContentType } from "@/stores/createPostStore";
import toast from "react-hot-toast";

export const usePosts = (page = 1, limit = 5) => {
  // fetching all posts
  return useQuery({
    queryKey: ["posts"],
    queryFn: () => apiClient.get(`/api/posts?page=${page}&limit=${limit}`),
    staleTime: 1000 * 60 * 5, // stale time is 5 mins
    refetchOnWindowFocus: true,
  });
};

// NEW: Infinite scrolling hook
export const useInfinitePosts = (limit = 5) => {
  return useInfiniteQuery({
    queryKey: ["posts", "infinite"],
    queryFn: ({ pageParam = 1 }) =>
      apiClient.get(`/api/posts?page=${pageParam}&limit=${limit}`),
    getNextPageParam: (lastPage) => {
      // Check if there's a next page based on pagination data
      if (lastPage?.pagination?.hasNextPage) {
        return lastPage.pagination.page + 1;
      }
      return undefined; // No more pages
    },
    getPreviousPageParam: (firstPage) => {
      // Check if there's a previous page
      if (firstPage?.pagination?.hasPreviousPage) {
        return firstPage.pagination.page - 1;
      }
      return undefined;
    },
    staleTime: 1000 * 60 * 5, // stale time is 5 mins
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

  const {
    getPostDataForAPI,
    resetForm,
    setIsSubmitting,
    setLastSubmittedPost,
  } = useCreatePostStore();

  return useMutation({
    mutationFn: async (postData) => {
      const formData = new FormData();

      // Add the main post data (matching your sample structure)
      formData.append("userId", postData.userId.toString());
      formData.append("caption", postData.caption || "");
      formData.append("location", postData.location || "");
      formData.append("contentType", postData.contentType);
      formData.append("allowsComments", postData.allowsComments.toString());
      formData.append("allowsShares", postData.allowsShares.toString());

      // Optional fields
      if (postData.thumbnailUrl) {
        formData.append("thumbnailUrl", postData.thumbnailUrl);
      }
      if (postData.taggedUsers) {
        formData.append("taggedUsers", JSON.stringify(postData.taggedUsers));
      }
      if (postData.privacyLevel) {
        formData.append("privacyLevel", postData.privacyLevel);
      }
      if (postData.expiresAt) {
        formData.append("expiresAt", postData.expiresAt);
      }

      // Add styling information as JSON string
      formData.append("styling", JSON.stringify(postData.styling));
      formData.append("timestamp", postData.timestamp);

      // Add files if they exist (only if content type is not TEXT)
      if (
        postData.files &&
        postData.files.length > 0 &&
        postData.contentType !== ContentType.TEXT
      ) {
        postData.files.forEach((file, index) => {
          formData.append(`files[${index}]`, file);
        });
        formData.append("fileCount", postData.files.length.toString());
      }

      // Add metadata
      if (postData.metadata) {
        formData.append("metadata", JSON.stringify(postData.metadata));
      }

      // Use your existing apiClient but with FormData
      return apiClient.post("/api/posts/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },

    onMutate: async (postData) => {
      // Set submitting state in Zustand
      setIsSubmitting(true);

      // Cancel outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ["posts"] });

      // Snapshot the previous value
      const previousPosts = queryClient.getQueryData(["posts"]);

      // Create optimistic post object
      const optimisticPost = {
        id: `temp-${Date.now()}`, // Temporary ID
        userId: postData.userId,
        caption: postData.caption,
        location: postData.location,
        contentType: postData.contentType,
        allowsComments: postData.allowsComments,
        allowsShares: postData.allowsShares,
        thumbnailUrl: postData.thumbnailUrl,
        taggedUsers: postData.taggedUsers,
        privacyLevel: postData.privacyLevel,
        expiresAt: postData.expiresAt,
        user: {
          // Get current user data from your auth context/store
          id: postData.userId,
          name: "You",
          avatar: "/current-user-avatar.jpg",
        },
        createdAt: new Date().toISOString(),
        isOptimistic: true, // Flag to identify optimistic updates
        likes: 0,
        comments: 0,
        shares: 0,
        // Include files for preview purposes (won't be sent to server in this format)
        files: postData.files || [],
        styling: postData.styling,
      };

      // Optimistically update the posts list
      queryClient.setQueryData(["posts"], (oldData) => {
        if (!oldData) return { data: [optimisticPost], total: 1 };

        // Handle different response structures
        if (Array.isArray(oldData)) {
          return [optimisticPost, ...oldData];
        }

        if (oldData.data && Array.isArray(oldData.data)) {
          return {
            ...oldData,
            data: [optimisticPost, ...oldData.data],
            total: (oldData.total || 0) + 1,
          };
        }

        return oldData;
      });

      return { previousPosts, optimisticPost };
    },

    onSuccess: (response, variables, context) => {
      // Get the actual post data from server response
      const newPost = response.data || response;

      // Update the optimistic post with real server data
      queryClient.setQueryData(["posts"], (oldData) => {
        if (!oldData) return oldData;

        const updatePost = (posts) =>
          posts.map((post) =>
            post.id === context.optimisticPost.id
              ? { ...newPost, isOptimistic: false }
              : post
          );

        if (Array.isArray(oldData)) {
          return updatePost(oldData);
        }

        if (oldData.data && Array.isArray(oldData.data)) {
          return {
            ...oldData,
            data: updatePost(oldData.data),
          };
        }

        return oldData;
      });

      // Store the submitted post in Zustand for reference
      setLastSubmittedPost(newPost);

      // Reset the form
      resetForm();

      // Show success message based on content type
      const contentTypeMessages = {
        [ContentType.TEXT]: "Text post created successfully! 📝",
        [ContentType.IMAGE]: "Image post created successfully! 📸",
        [ContentType.VIDEO]: "Video post created successfully! 🎥",
        [ContentType.MIXED]: "Mixed media post created successfully! 🎭",
      };

      toast.success(
        contentTypeMessages[variables.contentType] ||
          "Post created successfully! 🎉"
      );

      // Optional: Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ["user-posts"] });
      queryClient.invalidateQueries({ queryKey: ["user-stats"] });
    },

    onError: (error, variables, context) => {
      // Rollback the optimistic update
      if (context?.previousPosts) {
        queryClient.setQueryData(["posts"], context.previousPosts);
      }

      // Extract error message
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to create post";

      // Show error toast with content type context
      toast.error(
        `Failed to create ${variables.contentType.toLowerCase()} post: ${errorMessage}`
      );

      // Log for debugging
      console.error("Post creation failed:", {
        error,
        contentType: variables.contentType,
        hasFiles: variables.files?.length > 0,
        fileCount: variables.files?.length || 0,
      });
    },

    onSettled: () => {
      // Always reset submitting state
      setIsSubmitting(false);

      // Invalidate and refetch posts to ensure consistency
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
      queryClient.setQueryData(["posts", postId], (oldPost) => {
        if (!oldPost) return oldPost;
        return {
          ...oldPost,
          liked: true,
          _count: {
            ...oldPost._count,
            likes: oldPost._count.likes + 1,
          },
        };
      });

      queryClient.setQueryData(["posts", "infinite"], (oldData) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            posts: page.posts.map((post) =>
              post.id === postId
                ? {
                    ...post,
                    liked: true,
                    _count: {
                      ...post._count,
                      likes: post._count.likes + 1,
                    },
                  }
                : post
            ),
          })),
        };
      });
    },
    onError: (error) => {
      console.error("Failed to like post:", error);
    },
  });
};

// for unliking the post
export const useUnlikePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId) => apiClient.delete(`/api/posts/${postId}/like`),
    onSuccess: (data, postId) => {
      queryClient.setQueryData(["posts", postId], (oldPost) => {
        if (!oldPost) return oldPost;
        return {
          ...oldPost,
          liked: false, // Changed from true
          _count: {
            ...oldPost._count,
            likes: oldPost._count.likes - 1, // Changed from +1
          },
        };
      });

      queryClient.setQueryData(["posts", "infinite"], (oldData) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            posts: page.posts.map((post) =>
              post.id === postId
                ? {
                    ...post,
                    liked: false, // Changed from true
                    _count: {
                      ...post._count,
                      likes: post._count.likes - 1, // Changed from +1
                    },
                  }
                : post
            ),
          })),
        };
      });
    },
    onError: (error) => {
      console.error("Failed to unlike post:", error); // Updated message
      toast.error("Failed to unlike post."); // Updated message
    },
  });
};

// FOR BOOKMARK
export const useBookmarkPost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId) => apiClient.post(`/api/posts/${postId}/bookmark`),
    onSuccess: (data, postId) => {
      queryClient.setQueryData(["posts"], (oldData) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          posts: oldData.posts.map((post) =>
            post.id === postId ? { ...post, bookmarked: true } : post
          ),
        };
      });
    },
  });
};

// ─── COMMENTS ─────────────────────────────────────────────────────────────────

export const useComments = (postId) => {
  return useInfiniteQuery({
    queryKey: ["comments", postId],
    queryFn: ({ pageParam }) =>
      apiClient.get(
        `/api/posts/${postId}/comments?limit=10${pageParam ? `&cursor=${pageParam}` : ""}`
      ),
    getNextPageParam: (lastPage) => lastPage?.pagination?.nextCursor ?? undefined,
    enabled: !!postId,
    staleTime: 1000 * 30,
  });
};

export const useCreateComment = (postId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ content, parentCommentId }) =>
      apiClient.post(`/api/posts/${postId}/comments`, {
        content,
        parentCommentId: parentCommentId || null,
      }),

    onSuccess: () => {
      // Invalidate comment list and refresh counts in infinite feed
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      queryClient.setQueryData(["posts", "infinite"], (oldData) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            posts: page.posts.map((post) =>
              post.id === postId
                ? {
                    ...post,
                    _count: {
                      ...post._count,
                      comments: post._count.comments + 1,
                    },
                  }
                : post
            ),
          })),
        };
      });
    },
    onError: () => {
      toast.error("Failed to post comment.");
    },
  });
};

export const useDeleteComment = (postId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId) =>
      apiClient.delete(`/api/posts/${postId}/comments/${commentId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      queryClient.setQueryData(["posts", "infinite"], (oldData) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            posts: page.posts.map((post) =>
              post.id === postId
                ? {
                    ...post,
                    _count: {
                      ...post._count,
                      comments: Math.max(0, post._count.comments - 1),
                    },
                  }
                : post
            ),
          })),
        };
      });
    },
    onError: () => {
      toast.error("Failed to delete comment.");
    },
  });
};

// ─── SHARES ───────────────────────────────────────────────────────────────────

export const useSharePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, caption, privacyLevel }) =>
      apiClient.post(`/api/posts/${postId}/shares`, {
        ...(caption ? { caption } : {}),
        privacyLevel: privacyLevel || "PUBLIC",
      }),
    onSuccess: (data, { postId }) => {
      queryClient.setQueryData(["posts", "infinite"], (oldData) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            posts: page.posts.map((post) =>
              post.id === postId
                ? {
                    ...post,
                    shared: true,
                    _count: {
                      ...post._count,
                      shares: post._count.shares + 1,
                    },
                  }
                : post
            ),
          })),
        };
      });
      toast.success("Post shared!");
    },
    onError: (error) => {
      const msg = error?.response?.data?.error;
      if (msg?.includes("already shared")) {
        toast.error("You already shared this post.");
      } else {
        toast.error("Failed to share post.");
      }
    },
  });
};

export const useUnsharePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId) => apiClient.delete(`/api/posts/${postId}/shares`),
    onSuccess: (data, postId) => {
      queryClient.setQueryData(["posts", "infinite"], (oldData) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            posts: page.posts.map((post) =>
              post.id === postId
                ? {
                    ...post,
                    shared: false,
                    _count: {
                      ...post._count,
                      shares: Math.max(0, post._count.shares - 1),
                    },
                  }
                : post
            ),
          })),
        };
      });
      toast.success("Share removed.");
    },
    onError: () => {
      toast.error("Failed to remove share.");
    },
  });
};
