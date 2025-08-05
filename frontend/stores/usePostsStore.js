// stores/usePostsStore.js
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { enableMapSet } from "immer";

enableMapSet();

export const usePostsStore = create(
  immer((set, get) => ({
    // Post interactions state
    postInteractions: new Map(),

    // Initialize post interaction state
    initializePost: (postId, initialData) =>
      set((state) => {
        if (!state.postInteractions.has(postId)) {
          state.postInteractions.set(postId, {
            liked: initialData.liked || false,
            likeCount: initialData.likeCount || 0,
            bookmarked: initialData.bookmarked || false,
            shareCount: initialData.shareCount || 0,
            allowsComments: initialData.allowsComments,
            allowsShares: initialData.allowsShares,
            currentSlide: 0,
          });
        }
      }),

    // Like/unlike post
    toggleLike: (postId) =>
      set((state) => {
        const interaction = state.postInteractions.get(postId);
        if (interaction) {
          interaction.liked = !interaction.liked;
          interaction.likeCount += interaction.liked ? 1 : -1;
        }
      }),

    // Toggle bookmark
    toggleBookmark: (postId) =>
      set((state) => {
        const interaction = state.postInteractions.get(postId);
        if (interaction) {
          interaction.bookmarked = !interaction.bookmarked;
        }
      }),

    // Increment share count (with permission check)
    incrementShare: (postId) =>
      set((state) => {
        const interaction = state.postInteractions.get(postId);
        if (interaction && interaction.allowedShares) {
          interaction.shareCount += 1;
        }
      }),

    // Update current slide for carousel
    setCurrentSlide: (postId, slideIndex) =>
      set((state) => {
        const interaction = state.postInteractions.get(postId);
        if (interaction) {
          interaction.currentSlide = slideIndex;
        }
      }),

    // Toggle comment permissions for post owner
    toggleCommentPermission: (postId) =>
      set((state) => {
        const interaction = state.postInteractions.get(postId);
        if (interaction) {
          interaction.allowsComments = !interaction.allowsComments;
        }
      }),

    // Toggle share permissions for post owner
    toggleSharePermission: (postId) =>
      set((state) => {
        const interaction = state.postInteractions.get(postId);
        if (interaction) {
          interaction.allowsShares = !interaction.allowsShares;
        }
      }),

    // Get post interaction data
    getPostInteraction: (postId) => {
      return (
        get().postInteractions.get(postId) || {
          liked: false,
          likeCount: 0,
          bookmarked: false,
          shareCount: 0,
          allowsComments: false,
          allowsShares: true,
          currentSlide: 0,
        }
      );
    },

    // Check if comments are allowed for a post
    canComment: (postId) => {
      const interaction = get().postInteractions.get(postId);
      return interaction ? interaction.allowsComments : false; // Changed from true to false
    },

    // Check if shares are allowed for a post
    canShare: (postId) => {
      const interaction = get().postInteractions.get(postId);
      return interaction ? interaction.allowsShares : true;
    },

    // Clear all interactions (useful for logout)
    clearInteractions: () =>
      set((state) => {
        state.postInteractions.clear();
      }),

    // Batch update multiple posts (useful for server sync)
    batchUpdateInteractions: (updates) => {
      if (!updates || updates.length === 0) return;

      set((state) => {
        updates.forEach(({ postId, data }) => {
          const existing = state.postInteractions.get(postId) || {};
          // Only update if data has actually changed
          const hasChanged = Object.keys(data).some(
            (key) => existing[key] !== data[key]
          );
          if (hasChanged) {
            state.postInteractions.set(postId, { ...existing, ...data });
          }
        });
      });
    },
  }))
);
