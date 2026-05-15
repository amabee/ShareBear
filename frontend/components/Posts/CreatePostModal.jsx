"use client";

import { useRef, useEffect, useState } from "react";
import {
  Camera,
  ImageIcon,
  X,
  Smile,
  MapPin,
  Globe,
  Loader2,
  ChevronDown,
} from "lucide-react";
import { AspectRatio } from "../ui/aspect-ratio";
import EmojiPicker from "emoji-picker-react";
import { useCreatePostStore } from "@/stores/createPostStore";
import { useCreatePost } from "@/hooks/usePosts";
import { useAuth } from "@/hooks/useNextAuth";
import { useUserDetail } from "@/hooks/useUser";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export function CreatePostModal({ open, onOpenChange }) {
  const {
    text,
    files,
    isDragging,
    showEmojiPicker,
    showLocationPicker,
    selectedLocation,
    locationSearch,
    isSubmitting,

    setText,
    addFiles,
    removeFile,
    setFiles,
    setIsDragging,
    setShowEmojiPicker,
    setShowLocationPicker,
    setSelectedLocation,
    setLocationSearch,
    addEmoji,
    resetForm,
    getPostDataForAPI,
    validatePost,
    getIsDisabled,
  } = useCreatePostStore();

  const createPostMutation = useCreatePost();
  const { user } = useAuth();
  const { data: profileData } = useUserDetail(user?.username);
  const avatarUrl = profileData?.user?.userInfo?.profilePictureUrl;
  const displayName =
    profileData?.user?.userInfo?.displayName ||
    [profileData?.user?.userInfo?.firstName, profileData?.user?.userInfo?.lastName]
      .filter(Boolean)
      .join(" ") ||
    user?.username ||
    "You";

  const fileInputRef = useRef(null);
  const modalRef = useRef(null);
  const emojiPickerRef = useRef(null);
  const textareaRef = useRef(null);

  const sampleLocations = [
    "New York, NY", "Los Angeles, CA", "Chicago, IL", "Houston, TX",
    "Phoenix, AZ", "San Diego, CA", "Dallas, TX", "Austin, TX",
  ];
  const filteredLocations = sampleLocations.filter((l) =>
    l.toLowerCase().includes(locationSearch.toLowerCase())
  );

  // Click outside to close emoji picker
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(e.target)) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setShowEmojiPicker]);

  // Escape / outside-modal close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        if (showEmojiPicker) setShowEmojiPicker(false);
        else if (showLocationPicker) setShowLocationPicker(false);
        else onOpenChange(false);
      }
    };
    if (open) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [open, onOpenChange, showEmojiPicker, showLocationPicker, setShowEmojiPicker, setShowLocationPicker]);

  // Auto-resize textarea
  const autoResize = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  };

  const handleFileSelect = (selectedFiles) => {
    if (selectedFiles) addFiles(Array.from(selectedFiles));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = Array.from(e.dataTransfer.files).filter(
      (f) => f.type.startsWith("image/") || f.type.startsWith("video/")
    );
    if (dropped.length) addFiles(dropped);
  };

  const handleSubmit = async () => {
    const { isValid } = validatePost();
    if (!isValid) return;
    try {
      await createPostMutation.mutateAsync(getPostDataForAPI());
      onOpenChange(false);
    } catch (_) {}
  };

  const isDisabled = getIsDisabled();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
      />

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*"
        multiple
        onChange={(e) => handleFileSelect(e.target.files)}
        className="hidden"
      />

      {/* Sheet */}
      <div
        ref={modalRef}
        className="relative w-full sm:max-w-lg bg-card dark:bg-[#1a1a2e] rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 sm:zoom-in-95 duration-300"
        style={{ maxHeight: "92dvh" }}
      >
        {/* Drag handle (mobile) */}
        <div className="sm:hidden flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border/50">
          <h2 className="font-bold text-lg">Create post</h2>
          <button
            onClick={() => onOpenChange(false)}
            className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto" style={{ maxHeight: "calc(92dvh - 140px)" }}>
          {/* Author row */}
          <div className="flex items-center gap-3 px-5 pt-4">
            <Avatar className="h-11 w-11 ring-2 ring-background">
              <AvatarImage src={avatarUrl} className="object-cover" />
              <AvatarFallback className="text-sm font-semibold bg-gradient-to-br from-primary/20 to-primary/40 text-primary">
                {displayName?.[0]?.toUpperCase() ?? "?"}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-sm leading-tight">{displayName}</p>
              <button className="flex items-center gap-1 mt-0.5 text-xs font-medium bg-muted rounded-full px-2 py-0.5 text-muted-foreground hover:text-foreground transition-colors">
                <Globe className="h-3 w-3" />
                Public
                <ChevronDown className="h-3 w-3" />
              </button>
            </div>
          </div>

          {/* Caption textarea */}
          <div className="px-5 pt-3 pb-2">
            <textarea
              ref={textareaRef}
              value={text}
              onChange={(e) => { setText(e.target.value); autoResize(); }}
              placeholder="What's on your mind?"
              rows={3}
              maxLength={2000}
              className="w-full bg-transparent resize-none border-none outline-none text-[15px] leading-relaxed placeholder:text-muted-foreground/60 min-h-[80px] max-h-64"
            />
          </div>

          {/* Location badge */}
          {selectedLocation && (
            <div className="px-5 pb-2 flex items-center gap-1.5 text-blue-500 text-xs font-medium">
              <MapPin className="h-3.5 w-3.5" />
              {selectedLocation}
              <button
                onClick={() => setSelectedLocation("")}
                className="ml-1 text-muted-foreground hover:text-foreground"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}

          {/* Media previews */}
          {files.length > 0 && (
            <div className="px-5 pb-4">
              <div
                className={cn(
                  "grid gap-1.5 rounded-2xl overflow-hidden",
                  files.length === 1 ? "grid-cols-1" : files.length === 2 ? "grid-cols-2" : "grid-cols-3"
                )}
              >
                {files.map((file, i) => {
                  const url = URL.createObjectURL(file);
                  return (
                    <div key={i} className="relative group">
                      <AspectRatio ratio={files.length === 1 ? 4 / 3 : 1}>
                        {file.type.startsWith("image/") ? (
                          <img
                            src={url}
                            alt=""
                            className="w-full h-full object-cover"
                            onLoad={() => URL.revokeObjectURL(url)}
                          />
                        ) : (
                          <video
                            src={url}
                            className="w-full h-full object-cover"
                            onLoadedData={() => URL.revokeObjectURL(url)}
                          />
                        )}
                      </AspectRatio>
                      <button
                        onClick={() => removeFile(i)}
                        className="absolute top-1.5 right-1.5 h-6 w-6 rounded-full bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3.5 w-3.5 text-white" />
                      </button>
                    </div>
                  );
                })}
              </div>
              <button
                onClick={() => setFiles([])}
                className="mt-2 text-xs text-muted-foreground hover:text-destructive transition-colors"
              >
                Remove all
              </button>
            </div>
          )}

          {/* Drop zone (when no files) */}
          {files.length === 0 && (
            <div
              className={cn(
                "mx-5 mb-4 border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer",
                isDragging
                  ? "border-primary bg-primary/5 scale-[0.99]"
                  : "border-border hover:border-primary/50 hover:bg-muted/50"
              )}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="h-10 w-10 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-2">
                <ImageIcon className="h-5 w-5 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium">Add photos or videos</p>
              <p className="text-xs text-muted-foreground mt-0.5">Drag & drop or tap to browse</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-border/50 px-5 py-3 bg-card dark:bg-[#1a1a2e]">
          <div className="flex items-center justify-between">
            {/* Toolbar icons */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="h-9 w-9 rounded-full flex items-center justify-center text-green-500 hover:bg-green-500/10 transition-colors"
                title="Add media"
              >
                <Camera className="h-5 w-5" />
              </button>

              <div className="relative">
                <button
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="h-9 w-9 rounded-full flex items-center justify-center text-yellow-500 hover:bg-yellow-500/10 transition-colors"
                  title="Emoji"
                >
                  <Smile className="h-5 w-5" />
                </button>
                {showEmojiPicker && (
                  <div ref={emojiPickerRef} className="absolute bottom-full left-0 mb-2 z-50">
                    <EmojiPicker
                      onEmojiClick={(data) => addEmoji(data.emoji)}
                      width={300}
                      height={380}
                      previewConfig={{ showPreview: false }}
                    />
                  </div>
                )}
              </div>

              <div className="relative">
                <button
                  onClick={() => setShowLocationPicker(!showLocationPicker)}
                  className={cn(
                    "h-9 w-9 rounded-full flex items-center justify-center transition-colors",
                    selectedLocation
                      ? "text-blue-500 bg-blue-500/10"
                      : "text-red-500 hover:bg-red-500/10"
                  )}
                  title="Location"
                >
                  <MapPin className="h-5 w-5" />
                </button>
                {showLocationPicker && (
                  <div className="absolute bottom-full left-0 mb-2 z-50 bg-popover border border-border rounded-2xl shadow-2xl w-72 overflow-hidden">
                    <div className="p-3 border-b border-border">
                      <input
                        type="text"
                        placeholder="Search location…"
                        value={locationSearch}
                        onChange={(e) => setLocationSearch(e.target.value)}
                        className="w-full text-sm bg-muted rounded-xl px-3 py-2 outline-none placeholder:text-muted-foreground"
                      />
                    </div>
                    <div className="max-h-52 overflow-y-auto">
                      {filteredLocations.map((loc, i) => (
                        <button
                          key={i}
                          onClick={() => { setSelectedLocation(loc); setShowLocationPicker(false); setLocationSearch(""); }}
                          className="w-full text-left px-4 py-2.5 text-sm hover:bg-muted transition-colors flex items-center gap-2"
                        >
                          <MapPin className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                          {loc}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={isDisabled || isSubmitting}
              className={cn(
                "px-5 py-2 rounded-full font-semibold text-sm transition-all duration-200",
                isDisabled || isSubmitting
                  ? "bg-muted text-muted-foreground cursor-not-allowed"
                  : "bg-primary text-primary-foreground hover:opacity-90 active:scale-95 shadow-sm"
              )}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-1.5">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Posting…
                </span>
              ) : (
                "Post"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

