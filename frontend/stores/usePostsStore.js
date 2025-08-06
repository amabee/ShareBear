// stores/usePostsStore.js
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { enableMapSet } from "immer";

enableMapSet();

export const usePostsStore = create(
  immer((set, get) => ({
    // UI-only state (not synced with server)
    postUIState: new Map(),

    // Initialize UI state for a post
    initializePostUI: (postId, initialData = {}) =>
      set((state) => {
        if (!state.postUIState.has(postId)) {
          state.postUIState.set(postId, {
            bookmarked: initialData.bookmarked || false,
            currentSlide: initialData.currentSlide || 0,
          });
        }
      }),

    // Toggle bookmark (UI state only - you'll need a server mutation too)
    toggleBookmark: (postId) =>
      set((state) => {
        const uiState = state.postUIState.get(postId) || {};
        state.postUIState.set(postId, {
          ...uiState,
          bookmarked: !uiState.bookmarked,
        });
      }),

    // Increment share count (you might want to move this to React Query too)
    incrementShare: (postId) => {
      console.log("Share incremented for:", postId);
    },

    // Update current slide for carousel (pure UI state)
    setCurrentSlide: (postId, slideIndex) =>
      set((state) => {
        const uiState = state.postUIState.get(postId) || {};
        state.postUIState.set(postId, {
          ...uiState,
          currentSlide: slideIndex,
        });
      }),

    // Get UI state for a post - DO NOT MUTATE HERE
    getPostInteraction: (postId) => {
      const state = get().postUIState.get(postId);
      if (state) return state;

      // Return default without mutating (let components handle initialization)
      return {
        bookmarked: false,
        currentSlide: 0,
      };
    },

    // Clear all UI state (useful for logout)
    clearUIState: () =>
      set((state) => {
        state.postUIState.clear();
      }),

    // Batch update UI state
    batchUpdateUIState: (updates) => {
      if (!updates || updates.length === 0) return;

      set((state) => {
        updates.forEach(({ postId, data }) => {
          const existing = state.postUIState.get(postId) || {};
          state.postUIState.set(postId, { ...existing, ...data });
        });
      });
    },
  }))
);
