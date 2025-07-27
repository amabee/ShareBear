import { create } from "zustand";
import { persist } from "zustand/middleware";

const useUserStore = create(
  persist(
    (set, get) => ({
      preferences: {
        theme: "light",
        notifications: true,
        language: "en",
      },
      
      // Cached user profile data (can be fetched separately from session)
      profileData: null,
      
      // UI state
      sidebarOpen: false,
      lastVisitedPage: "/",
      
      // Actions
      updatePreferences: (newPreferences) => {
        set((state) => ({
          preferences: { ...state.preferences, ...newPreferences },
        }));
      },
      
      setProfileData: (data) => {
        set({ profileData: data });
      },
      
      setSidebarOpen: (open) => {
        set({ sidebarOpen: open });
      },
      
      setLastVisitedPage: (page) => {
        set({ lastVisitedPage: page });
      },
      
      // Clear user-specific data on logout
      clearUserData: () => {
        set({
          profileData: null,
          sidebarOpen: false,
          lastVisitedPage: "/",
        });
      },
    }),
    {
      name: "user-store",
      partialize: (state) => ({
        preferences: state.preferences,
        lastVisitedPage: state.lastVisitedPage,
      }),
    }
  )
);

export default useUserStore; 
