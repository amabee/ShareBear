import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

const ContentType = {
  TEXT: "TEXT",
  IMAGE: "IMAGE",
  VIDEO: "VIDEO",
  MIXED: "MIXED",
};

export const useCreatePostStore = create(
  subscribeWithSelector((set, get) => ({
    // Modal state
    isOpen: false,

    // Post content
    text: "",
    files: [],
    selectedLocation: "",

    // Styling
    selectedBg: "white",
    textAlign: "left",
    fontSize: "medium",
    isBold: false,
    isItalic: false,

    // UI state
    activeTab: "text",
    showEmojiPicker: false,
    showLocationPicker: false,
    locationSearch: "",
    isDragging: false,

    // Submission state (for optimistic updates)
    isSubmitting: false,
    lastSubmittedPost: null,

    // Actions
    setIsOpen: (open) => set({ isOpen: open }),
    setText: (text) => set({ text }),
    setFiles: (files) => set({ files }),
    addFiles: (newFiles) =>
      set((state) => ({
        files: [...state.files, ...newFiles],
      })),
    removeFile: (index) =>
      set((state) => ({
        files: state.files.filter((_, i) => i !== index),
      })),
    clearFiles: () => set({ files: [] }),

    setSelectedLocation: (location) => set({ selectedLocation: location }),
    setSelectedBg: (bg) => set({ selectedBg: bg }),
    setTextAlign: (align) => set({ textAlign: align }),
    setFontSize: (size) => set({ fontSize: size }),
    setIsBold: (bold) => set({ isBold: bold }),
    setIsItalic: (italic) => set({ isItalic: italic }),

    setActiveTab: (tab) => set({ activeTab: tab }),
    setShowEmojiPicker: (show) => set({ showEmojiPicker: show }),
    setShowLocationPicker: (show) => set({ showLocationPicker: show }),
    setLocationSearch: (search) => set({ locationSearch: search }),
    setIsDragging: (dragging) => set({ isDragging: dragging }),

    // Submission state
    setIsSubmitting: (submitting) => set({ isSubmitting: submitting }),
    setLastSubmittedPost: (post) => set({ lastSubmittedPost: post }),

    // Complex actions
    addEmoji: (emoji) =>
      set((state) => ({
        text: state.text + emoji,
        showEmojiPicker: false,
      })),

    resetForm: () =>
      set({
        text: "",
        files: [],
        selectedLocation: "",
        selectedBg: "white",
        textAlign: "left",
        fontSize: "medium",
        isBold: false,
        isItalic: false,
        activeTab: "text",
        showEmojiPicker: false,
        showLocationPicker: false,
        locationSearch: "",
        isDragging: false,
        isSubmitting: false,
      }),

    // Helper function to determine content type
    getContentType: () => {
      const { files } = get();

      if (!files || files.length === 0) {
        return ContentType.TEXT;
      }

      // Check if all files are images
      const hasImages = files.some((file) => file.type.startsWith("image/"));
      const hasVideos = files.some((file) => file.type.startsWith("video/"));

      if (hasImages && hasVideos) {
        return ContentType.MIXED; // If you support mixed content
      } else if (hasVideos) {
        return ContentType.VIDEO;
      } else if (hasImages) {
        return ContentType.IMAGE;
      }

      return ContentType.TEXT; // fallback
    },

    // Enhanced get post data with validation
    getPostData: () => {
      const state = get();
      return {
        text: state.text.trim(), // Trim whitespace
        files: state.files,
        location: state.selectedLocation,
        styling: {
          background: state.selectedBg,
          textAlign: state.textAlign,
          fontSize: state.fontSize,
          isBold: state.isBold,
          isItalic: state.isItalic,
        },
        contentType: state.getContentType(),
        timestamp: new Date().toISOString(),
      };
    },

    // Enhanced method for API submission (matches your sample data structure)
    getPostDataForAPI: () => {
      const state = get();
      const contentType = state.getContentType();

      const postData = {
        userId: 39, // You might want to get this from auth context/store
        caption: state.text.trim() || undefined, // Use caption instead of text
        thumbnailUrl: undefined, // You might generate this for videos
        location: state.selectedLocation || "",
        taggedUsers: undefined, // You can add tagging functionality later
        privacyLevel: undefined, // You can add privacy settings later
        allowsComments: false, // You can make this configurable
        allowsShares: false, // You can make this configurable
        expiresAt: null, // You can add expiration functionality later
        contentType: contentType,

        // Additional data for your component (not sent to API)
        files: state.files,
        styling: {
          background: state.selectedBg,
          textAlign: state.textAlign,
          fontSize: state.fontSize,
          isBold: state.isBold,
          isItalic: state.isItalic,
        },
        timestamp: new Date().toISOString(),

        // Add metadata for analytics/debugging
        metadata: {
          platform: "web",
          fileCount: state.files.length,
          hasLocation: !!state.selectedLocation,
          textLength: state.text.trim().length,
          contentType: contentType,
        },
      };

      return postData;
    },

    // Validation method (updated to include content type validation)
    validatePost: () => {
      const state = get();
      const errors = [];
      const contentType = state.getContentType();

      // Check if post has content
      if (!state.text.trim() && state.files.length === 0) {
        errors.push("Post must have text or files");
      }

      // Check text length (adjust limits as needed)
      if (state.text.length > 2000) {
        errors.push("Text is too long (max 2000 characters)");
      }

      // Check file count
      if (state.files.length > 10) {
        errors.push("Too many files (max 10)");
      }

      // Check individual file sizes (10MB limit)
      const maxFileSize = 10 * 1024 * 1024;
      const oversizedFiles = state.files.filter(
        (file) => file.size > maxFileSize
      );
      if (oversizedFiles.length > 0) {
        errors.push(`${oversizedFiles.length} file(s) exceed 10MB limit`);
      }

      // Check file types (optional - adjust as needed)
      const allowedTypes = ["image/", "video/"];
      const invalidFiles = state.files.filter(
        (file) => !allowedTypes.some((type) => file.type.startsWith(type))
      );
      if (invalidFiles.length > 0) {
        errors.push("Only images and videos are allowed");
      }

      // Content type specific validation
      if (contentType === ContentType.TEXT && state.files.length > 0) {
        errors.push("TEXT content type should not have files");
      }

      if (contentType !== ContentType.TEXT && state.files.length === 0) {
        errors.push(`${contentType} content type requires files`);
      }

      return {
        isValid: errors.length === 0,
        errors,
        contentType, // Include content type in validation result
      };
    },

    // Computed values
    getIsDisabled: () => {
      const { text, files, isSubmitting } = get();
      return (!text.trim() && files.length === 0) || isSubmitting;
    },

    // Helper to get current background options (if you have backgroundOptions imported)
    getCurrentBg: () => {
      const { selectedBg } = get();
      // Assuming you have backgroundOptions array available
      // return backgroundOptions.find((bg) => bg.id === selectedBg);
      return selectedBg; // Simplified version
    },

    getCurrentFontSize: () => {
      const { fontSize } = get();
      // Assuming you have fontSizes array available
      // return fontSizes.find((fs) => fs.id === fontSize);
      return fontSize; // Simplified version
    },

    // Helper to get computed text styles
    getTextStyle: () => {
      const { fontSize, isBold, isItalic, textAlign, selectedBg } = get();

      // You might want to move this logic here or keep it in component
      // This is a simplified version - adjust based on your backgroundOptions/fontSizes
      const fontSizeClass =
        {
          small: "text-sm",
          medium: "text-base",
          large: "text-lg",
          xl: "text-xl",
        }[fontSize] || "text-base";

      return `${fontSizeClass} ${isBold ? "font-bold" : "font-normal"} ${
        isItalic ? "italic" : ""
      } text-${textAlign}`;
    },

    // Utility methods for better UX
    hasUnsavedChanges: () => {
      const state = get();
      return !!(
        state.text.trim() ||
        state.files.length > 0 ||
        state.selectedLocation ||
        state.selectedBg !== "white" ||
        state.textAlign !== "left" ||
        state.fontSize !== "medium" ||
        state.isBold ||
        state.isItalic
      );
    },

    // Method to close all popups/pickers
    closeAllPopups: () =>
      set({
        showEmojiPicker: false,
        showLocationPicker: false,
        locationSearch: "",
      }),

    // Batch update method for better performance
    updateStyling: (styles) =>
      set((state) => ({
        ...state,
        ...styles,
      })),
  }))
);

// Export ContentType for use in other files
export { ContentType };

// Optional: Create selectors for commonly used combinations
export const useCreatePostSelectors = {
  // Get all form data
  useFormData: () =>
    useCreatePostStore((state) => ({
      text: state.text,
      files: state.files,
      selectedLocation: state.selectedLocation,
      contentType: state.getContentType(),
    })),

  // Get all styling data
  useStylingData: () =>
    useCreatePostStore((state) => ({
      selectedBg: state.selectedBg,
      textAlign: state.textAlign,
      fontSize: state.fontSize,
      isBold: state.isBold,
      isItalic: state.isItalic,
    })),

  // Get all UI state
  useUIState: () =>
    useCreatePostStore((state) => ({
      activeTab: state.activeTab,
      showEmojiPicker: state.showEmojiPicker,
      showLocationPicker: state.showLocationPicker,
      isDragging: state.isDragging,
    })),

  // Get submission state
  useSubmissionState: () =>
    useCreatePostStore((state) => ({
      isSubmitting: state.isSubmitting,
      lastSubmittedPost: state.lastSubmittedPost,
      isDisabled: state.getIsDisabled(),
      contentType: state.getContentType(),
    })),
};
