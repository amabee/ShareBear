// stores/useSuggestionsStore.js
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { enableMapSet } from "immer";

enableMapSet();

export const useSuggestionsStore = create(
  immer((set, get) => ({
    suggestionInteractions: new Map(),

    suggestionsLoading: false,
    suggestionsError: null,
    showAllSuggestions: false,

    initializeSuggestion: (userId, initialData) =>
      set((state) => {
        if (!state.suggestionInteractions.has(userId)) {
          state.suggestionInteractions.set(userId, {
            isFollowing: initialData.isFollowing || false,
            isFollowPending: false,
            isDismissed: initialData.isDismissed || false,
            username: initialData.username,
            displayName: initialData.displayName,
            avatar: initialData.avatar,
            mutualFollowers: initialData.mutualFollowers || 0,
            followersCount: initialData.followersCount || 0,
            isVerified: initialData.isVerified || false,
          });
        }
      }),

    toggleFollow: (userId) =>
      set((state) => {
        const suggestion = state.suggestionInteractions.get(userId);
        if (suggestion && !suggestion.isFollowPending) {
          suggestion.isFollowPending = true;
          suggestion.isFollowing = !suggestion.isFollowing;
        }
      }),

    completeFollowAction: (userId, success = true) =>
      set((state) => {
        const suggestion = state.suggestionInteractions.get(userId);
        if (suggestion) {
          suggestion.isFollowPending = false;
          if (!success) {
            suggestion.isFollowing = !suggestion.isFollowing;
          }
        }
      }),

    dismissSuggestion: (userId) =>
      set((state) => {
        const suggestion = state.suggestionInteractions.get(userId);
        if (suggestion) {
          suggestion.isDismissed = true;
        }
      }),

    undoDismissSuggestion: (userId) =>
      set((state) => {
        const suggestion = state.suggestionInteractions.get(userId);
        if (suggestion) {
          suggestion.isDismissed = false;
        }
      }),

    updateMutualFollowers: (userId, count) =>
      set((state) => {
        const suggestion = state.suggestionInteractions.get(userId);
        if (suggestion) {
          suggestion.mutualFollowers = count;
        }
      }),

    setSuggestionsLoading: (loading) =>
      set((state) => {
        state.suggestionsLoading = loading;
      }),

    setSuggestionsError: (error) =>
      set((state) => {
        state.suggestionsError = error;
      }),

    toggleShowAllSuggestions: () =>
      set((state) => {
        state.showAllSuggestions = !state.showAllSuggestions;
      }),

    getSuggestionInteraction: (userId) => {
      return (
        get().suggestionInteractions.get(userId) || {
          isFollowing: false,
          isFollowPending: false,
          isDismissed: false,
          username: "",
          displayName: "",
          avatar: "",
          mutualFollowers: 0,
          followersCount: 0,
          isVerified: false,
        }
      );
    },

    getActiveSuggestions: () => {
      const interactions = get().suggestionInteractions;
      const activeSuggestions = [];

      interactions.forEach((suggestion, userId) => {
        if (!suggestion.isDismissed && !suggestion.isFollowing) {
          activeSuggestions.push({ userId, ...suggestion });
        }
      });

      return activeSuggestions;
    },

    getFollowedFromSuggestions: () => {
      const interactions = get().suggestionInteractions;
      const followed = [];

      interactions.forEach((suggestion, userId) => {
        if (suggestion.isFollowing) {
          followed.push({ userId, ...suggestion });
        }
      });

      return followed;
    },

    isFollowing: (userId) => {
      const suggestion = get().suggestionInteractions.get(userId);
      return suggestion ? suggestion.isFollowing : false;
    },

    isFollowPending: (userId) => {
      const suggestion = get().suggestionInteractions.get(userId);
      return suggestion ? suggestion.isFollowPending : false;
    },

    isDismissed: (userId) => {
      const suggestion = get().suggestionInteractions.get(userId);
      return suggestion ? suggestion.isDismissed : false;
    },

    clearSuggestions: () =>
      set((state) => {
        state.suggestionInteractions.clear();
        state.suggestionsError = null;
        state.suggestionsLoading = false;
        state.showAllSuggestions = false;
      }),

    batchUpdateSuggestions: (updates) => {
      if (!updates || updates.length === 0) return;

      set((state) => {
        updates.forEach(({ userId, data }) => {
          const existing = state.suggestionInteractions.get(userId) || {};
          const hasChanged = Object.keys(data).some(
            (key) => existing[key] !== data[key]
          );
          if (hasChanged) {
            state.suggestionInteractions.set(userId, { ...existing, ...data });
          }
        });
      });
    },

    batchInitializeSuggestions: (suggestionsList) => {
      if (!suggestionsList || suggestionsList.length === 0) return;

      set((state) => {
        suggestionsList.forEach((suggestion) => {
          const existing = state.suggestionInteractions.get(suggestion.id);

          state.suggestionInteractions.set(suggestion.id, {
            ...suggestion, // ✅ Store the full suggestion object
            isFollowing:
              existing?.isFollowing ?? suggestion.isFollowing ?? false,
            isDismissed:
              existing?.isDismissed ?? suggestion.isDismissed ?? false,
            isFollowPending: existing?.isFollowPending ?? false,
          });
        });
      });
    },

    // ✅ Fixed syncWithQueryData to handle raw arrays directly
    syncWithQueryData: (queryData) => {
      const suggestions = Array.isArray(queryData)
        ? queryData
        : queryData?.data?.suggestions || [];

      if (suggestions.length === 0) return;

      // Store the full suggestion object so you can access all fields
      get().batchInitializeSuggestions(suggestions);
    },
  }))
);
