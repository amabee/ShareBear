"use client";

import { useState, useRef, useEffect } from "react";
import {
  Camera,
  ImageIcon,
  X,
  Type,
  Palette,
  Bold,
  Italic,
  AlignCenter,
  AlignLeft,
  AlignRight,
  Smile,
  MapPin,
  Users,
  Sparkles,
  Check,
} from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { AspectRatio } from "../ui/aspect-ratio";

export function CreatePostModal({ open, onOpenChange }) {
  const [text, setText] = useState("");
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedBg, setSelectedBg] = useState("white");
  const [textAlign, setTextAlign] = useState("left");
  const [fontSize, setFontSize] = useState("medium");
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [activeTab, setActiveTab] = useState("text");
  const fileInputRef = useRef(null);
  const modalRef = useRef(null);

  const backgroundOptions = [
    {
      id: "white",
      name: "Default",
      color: "bg-white",
      textColor: "text-gray-900",
      gradient: "from-white to-gray-50",
    },
    {
      id: "blue",
      name: "Ocean",
      color: "bg-blue-500",
      textColor: "text-white",
      gradient: "from-blue-400 to-blue-600",
    },
    {
      id: "purple",
      name: "Sunset",
      color: "bg-purple-500",
      textColor: "text-white",
      gradient: "from-purple-400 to-pink-500",
    },
    {
      id: "green",
      name: "Nature",
      color: "bg-green-500",
      textColor: "text-white",
      gradient: "from-green-400 to-emerald-600",
    },
    {
      id: "red",
      name: "Energy",
      color: "bg-red-500",
      textColor: "text-white",
      gradient: "from-red-400 to-rose-600",
    },
    {
      id: "yellow",
      name: "Sunshine",
      color: "bg-yellow-400",
      textColor: "text-gray-900",
      gradient: "from-yellow-300 to-orange-400",
    },
    {
      id: "pink",
      name: "Dream",
      color: "bg-pink-500",
      textColor: "text-white",
      gradient: "from-pink-400 to-rose-500",
    },
    {
      id: "gray",
      name: "Classic",
      color: "bg-gray-700",
      textColor: "text-white",
      gradient: "from-gray-600 to-gray-800",
    },
  ];

  const fontSizes = [
    { id: "small", name: "Small", size: "text-base" },
    { id: "medium", name: "Medium", size: "text-lg" },
    { id: "large", name: "Large", size: "text-xl" },
    { id: "xlarge", name: "Extra Large", size: "text-2xl" },
  ];

  const currentBg = backgroundOptions.find((bg) => bg.id === selectedBg);
  const currentFontSize = fontSizes.find((fs) => fs.id === fontSize);

  // Handle escape key and outside clicks
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onOpenChange(false);
      }
    };

    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onOpenChange(false);
      }
    };

    if (open) {
      document.addEventListener("keydown", handleEscape);
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "unset";
    };
  }, [open, onOpenChange]);

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  const handleFileSelect = (selectedFiles) => {
    if (selectedFiles) {
      const fileArray = Array.from(selectedFiles);
      setFiles((prev) => [...prev, ...fileArray]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files).filter(
      (file) => file.type.startsWith("image/") || file.type.startsWith("video/")
    );
    if (droppedFiles.length > 0) {
      setFiles((prev) => [...prev, ...droppedFiles]);
    }
  };

  const removeFile = (indexToRemove) => {
    setFiles((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = () => {
    alert("Post created! (mock)");
    setText("");
    setFiles([]);
    setSelectedBg("white");
    setTextAlign("left");
    setFontSize("medium");
    setIsBold(false);
    setIsItalic(false);
    setActiveTab("text");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onOpenChange(false);
  };

  const isDisabled = !text.trim() && files.length === 0;

  const getTextStyle = () => {
    return `${currentFontSize.size} ${isBold ? "font-bold" : "font-normal"} ${
      isItalic ? "italic" : ""
    } text-${textAlign} ${currentBg.textColor}`;
  };

  // Add this helper function after the existing helper functions
  const renderFilePreview = () => {
    if (!files || files.length === 0) return null;

    if (files.length === 1) {
      const file = files[0];
      const fileUrl = URL.createObjectURL(file);

      return (
        <div className="px-4 pb-4">
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 max-w-md mx-auto">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg">
                {file.type.startsWith("image/") ? (
                  <ImageIcon className="w-4 h-4 text-white" />
                ) : (
                  <Camera className="w-4 h-4 text-white" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {file.name}
                </p>
                <p className="text-xs text-gray-600">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <button
                onClick={() => removeFile(0)}
                className="p-1 hover:bg-red-100 rounded-lg transition-colors group"
              >
                <X className="w-4 h-4 text-gray-500 group-hover:text-red-500" />
              </button>
            </div>

            <div className="rounded-lg overflow-hidden bg-gray-100">
              <AspectRatio ratio={1 / 1} className="w-60 mx-auto">
                {file.type.startsWith("image/") ? (
                  <img
                    src={fileUrl || "/placeholder.svg"}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onLoad={() => URL.revokeObjectURL(fileUrl)}
                  />
                ) : (
                  <video
                    src={fileUrl}
                    className="w-full h-full object-cover"
                    controls
                    onLoadedData={() => URL.revokeObjectURL(fileUrl)}
                  />
                )}
              </AspectRatio>
            </div>
          </div>
        </div>
      );
    }

    // Multiple files - use carousel
    return (
      <div className="px-4 sm:px-6 pb-4 sm:pb-6">
        <div className="bg-gray-50 rounded-xl border border-gray-200 p-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                <ImageIcon className="w-4 h-4 text-white" />
              </div>
              <span className="font-medium text-gray-900 text-sm">
                {files.length} files selected
              </span>
            </div>
            <button
              onClick={() => setFiles([])}
              className="p-1 hover:bg-red-100 rounded-lg transition-colors group"
            >
              <X className="w-4 h-4 text-gray-500 group-hover:text-red-500" />
            </button>
          </div>

          <Carousel className="w-full">
            <CarouselContent>
              {files.map((file, index) => {
                const fileUrl = URL.createObjectURL(file);
                return (
                  <CarouselItem
                    key={index}
                    className="md:basis-1/2 lg:basis-1/3"
                  >
                    <div className="relative">
                      <AspectRatio
                        ratio={4 / 5}
                        className="rounded-lg overflow-hidden bg-gray-100"
                      >
                        {file.type.startsWith("image/") ? (
                          <img
                            src={fileUrl || "/placeholder.svg"}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-full object-cover"
                            onLoad={() => URL.revokeObjectURL(fileUrl)}
                          />
                        ) : (
                          <video
                            src={fileUrl}
                            className="w-full h-full object-cover"
                            controls
                            onLoadedData={() => URL.revokeObjectURL(fileUrl)}
                          />
                        )}
                        <button
                          onClick={() => removeFile(index)}
                          className="absolute top-2 right-2 p-1 bg-black/50 hover:bg-black/70 rounded-full transition-colors group"
                        >
                          <X className="w-3 h-3 text-white" />
                        </button>
                      </AspectRatio>
                      <p className="text-xs text-gray-600 mt-1 truncate">
                        {file.name}
                      </p>
                    </div>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
            <CarouselPrevious className="left-2" />
            <CarouselNext className="right-2" />
          </Carousel>
        </div>
      </div>
    );
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal */}
      <div
        ref={modalRef}
        className="relative bg-white rounded-2xl
         shadow-2xl w-full max-w-sm
          sm:max-w-md md:max-w-2xl
           lg:max-w-4xl xl:max-w-7xl 
           max-h-[95vh] sm:max-h-[90vh] mx-4 overflow-hidden animate-in fade-in-0 zoom-in-95 duration-200"
      >
        <div className="flex flex-col h-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-100 bg-gradient-to-r from-white to-gray-50">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <h2 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Create post
              </h2>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="hidden sm:flex items-center bg-gray-100 rounded-xl p-1">
                <button
                  onClick={() => setActiveTab("text")}
                  className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg font-medium transition-all duration-200 text-sm ${
                    activeTab === "text"
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <Type className="w-4 h-4" />
                  <span className="hidden sm:inline">Text</span>
                </button>
                <button
                  onClick={() => setActiveTab("background")}
                  className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg font-medium transition-all duration-200 text-sm ${
                    activeTab === "background"
                      ? "bg-white text-purple-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <Palette className="w-4 h-4" />
                  <span className="hidden sm:inline">Style</span>
                </button>
              </div>
              <button
                onClick={() => onOpenChange(false)}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
              </button>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-y-auto">
              {/* User Info */}
              <div className="flex items-center gap-3 sm:gap-4 p-4 sm:p-6 border-b border-gray-50">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500 rounded-full flex items-center justify-center ring-2 sm:ring-4 ring-blue-100">
                  <span className="text-white font-bold text-base sm:text-lg">
                    U
                  </span>
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-base sm:text-lg">
                    You
                  </p>
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500">
                    <Users className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="font-medium">Public</span>
                    <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                    <span className="hidden sm:inline">
                      Anyone can see this
                    </span>
                  </div>
                </div>
              </div>

              {/* Text Input Area */}
              <div className="flex-1 p-4 sm:p-6">
                <div
                  className={`bg-gradient-to-br ${currentBg.gradient} rounded-xl sm:rounded-2xl p-4 sm:p-8 min-h-[200px] sm:min-h-[280px] transition-all duration-500 shadow-inner border border-gray-100`}
                >
                  <textarea
                    className={`w-full bg-transparent resize-none border-none outline-none text-center ${getTextStyle()}`}
                    placeholder={
                      selectedBg === "white"
                        ? "What's on your mind?"
                        : "Share your thoughts with the world..."
                    }
                    value={text}
                    onChange={handleTextChange}
                    style={{
                      minHeight: window.innerWidth < 640 ? "160px" : "240px",
                      placeholderColor: currentBg.textColor.includes("white")
                        ? "rgba(255,255,255,0.8)"
                        : "rgba(0,0,0,0.6)",
                    }}
                  />
                </div>
              </div>

              {/* File Upload/Preview Area */}
              {files.length > 0 ? (
                renderFilePreview()
              ) : (
                <div className="px-4 sm:px-6 pb-4 sm:pb-6">
                  <div
                    className={`border-2 border-dashed rounded-xl sm:rounded-2xl p-6 sm:p-8 text-center transition-all cursor-pointer ${
                      isDragging
                        ? "border-blue-400 bg-blue-50 scale-105"
                        : "border-gray-300 hover:border-blue-400 hover:bg-blue-50"
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <div className="p-3 sm:p-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl sm:rounded-2xl w-fit mx-auto mb-3 sm:mb-4">
                      <Camera className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                    </div>
                    <p className="text-gray-900 font-semibold text-base sm:text-lg mb-1 sm:mb-2">
                      Add photos or videos
                    </p>
                    <p className="text-gray-500 text-sm">
                      Drag and drop or click to browse
                    </p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*,video/*"
                      multiple
                      onChange={(e) => handleFileSelect(e.target.files)}
                      className="hidden"
                    />
                  </div>
                </div>
              )}

              {/* Quick Actions */}
              <div className="px-4 sm:px-6 pb-4 sm:pb-6">
                <div className="flex items-center justify-between p-3 sm:p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl sm:rounded-2xl border border-gray-200">
                  <span className="text-xs sm:text-sm font-semibold text-gray-700">
                    Enhance your post
                  </span>
                  <div className="flex items-center gap-1 sm:gap-2">
                    <button
                      className="p-2 sm:p-3 hover:bg-white rounded-lg sm:rounded-xl transition-all hover:scale-110 group"
                      title="Photo/Video"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Camera className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 group-hover:text-green-600" />
                    </button>
                    <button
                      className="p-2 sm:p-3 hover:bg-white rounded-lg sm:rounded-xl transition-all hover:scale-110 group"
                      title="Feeling/Activity"
                    >
                      <Smile className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500 group-hover:text-yellow-600" />
                    </button>
                    <button
                      className="p-2 sm:p-3 hover:bg-white rounded-lg sm:rounded-xl transition-all hover:scale-110 group"
                      title="Check in"
                    >
                      <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 group-hover:text-red-600" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Mobile Tab Navigation */}
              <div className="lg:hidden px-4 sm:px-6 pb-4">
                <div className="flex items-center bg-gray-100 rounded-xl p-1">
                  <button
                    onClick={() => setActiveTab("text")}
                    className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg font-medium transition-all duration-200 text-sm ${
                      activeTab === "text"
                        ? "bg-white text-blue-600 shadow-sm"
                        : "text-gray-600"
                    }`}
                  >
                    <Type className="w-4 h-4" />
                    Text
                  </button>
                  <button
                    onClick={() => setActiveTab("background")}
                    className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg font-medium transition-all duration-200 text-sm ${
                      activeTab === "background"
                        ? "bg-white text-purple-600 shadow-sm"
                        : "text-gray-600"
                    }`}
                  >
                    <Palette className="w-4 h-4" />
                    Style
                  </button>
                </div>
              </div>

              {/* Post Button */}
              <div className="p-4 sm:p-6 border-t border-gray-100 bg-gradient-to-r from-white to-gray-50">
                <button
                  onClick={handleSubmit}
                  disabled={isDisabled}
                  className={`w-full py-3 sm:py-4 px-6 sm:px-8 rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg transition-all duration-300 ${
                    isDisabled
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-primary hover:cursor-pointer hover:scale-[1.02] active:scale-[0.98] text-white shadow-lg hover:shadow-xl"
                  }`}
                >
                  {isDisabled ? "Add content to post" : "Share with world"}
                </button>
              </div>
            </div>

            {/* Sidebar - Hidden on mobile, shown as overlay on tablet, sidebar on desktop */}
            <div
              className={`${
                activeTab === "text" || activeTab === "background"
                  ? "block"
                  : "hidden"
              } lg:block w-full lg:w-80 overflow-y-auto ${
                window.innerWidth < 1024
                  ? "absolute inset-0 bg-white z-10"
                  : "border-l border-gray-100 bg-gradient-to-b from-gray-50 to-white"
              }`}
            >
              {/* Mobile close button */}
              <div className="lg:hidden flex items-center justify-between p-4 border-b border-gray-200">
                <h3 className="font-bold text-gray-900 text-lg">
                  {activeTab === "background"
                    ? "Background Styles"
                    : "Text Styling"}
                </h3>
                <button
                  onClick={() => setActiveTab("")}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {activeTab === "background" && (
                <div className="p-4 sm:p-6">
                  <h3 className="hidden lg:block font-bold text-gray-900 mb-6 text-lg">
                    Background Styles
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-2 sm:gap-3">
                    {backgroundOptions.map((bg) => (
                      <button
                        key={bg.id}
                        onClick={() => setSelectedBg(bg.id)}
                        className={`bg-gradient-to-br ${
                          bg.gradient
                        } h-16 sm:h-20 rounded-lg sm:rounded-xl border-2 transition-all duration-300 relative 
                        overflow-hidden group ${
                          selectedBg === bg.id
                            ? "border-blue-500 scale-105 shadow-lg"
                            : "border-gray-200 hover:border-gray-300 hover:scale-102"
                        }`}
                      >
                        <span
                          className={`absolute bottom-1 sm:bottom-2 left-2 sm:left-3 text-xs font-bold 
                            ${bg.textColor} opacity-90`}
                        >
                          {bg.name}
                        </span>
                        {selectedBg === bg.id && (
                          <div className="absolute inset-0 bg-opacity-20 flex items-center justify-center">
                            <div className="w-8 h-8 sm:w-7 sm:h-7 border rounded-full shadow-lg 
                            bg-accent flex items-center justify-center">
                              <Check className="w-4 h-4" />
                            </div>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "text" && (
                <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                  <h3 className="hidden lg:block font-bold text-gray-900 text-lg">
                    Text Styling
                  </h3>

                  {/* Font Size */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                      Font Size
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {fontSizes.map((fs) => (
                        <button
                          key={fs.id}
                          onClick={() => setFontSize(fs.id)}
                          className={`p-2 sm:p-3 text-xs sm:text-sm rounded-lg sm:rounded-xl border-2 transition-all duration-200 font-medium ${
                            fontSize === fs.id
                              ? "bg-blue-100 border-blue-300 text-blue-700 scale-105"
                              : "bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          {fs.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Text Formatting */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                      Text Format
                    </label>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setIsBold(!isBold)}
                        className={`p-2 sm:p-3 rounded-lg sm:rounded-xl border-2 transition-all duration-200 ${
                          isBold
                            ? "bg-blue-100 border-blue-300 text-blue-700 scale-105"
                            : "bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        <Bold className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                      <button
                        onClick={() => setIsItalic(!isItalic)}
                        className={`p-2 sm:p-3 rounded-lg sm:rounded-xl border-2 transition-all duration-200 ${
                          isItalic
                            ? "bg-blue-100 border-blue-300 text-blue-700 scale-105"
                            : "bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        <Italic className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Text Alignment */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                      Text Alignment
                    </label>
                    <div className="flex gap-2">
                      {[
                        { id: "left", icon: AlignLeft },
                        { id: "center", icon: AlignCenter },
                        { id: "right", icon: AlignRight },
                      ].map(({ id, icon: Icon }) => (
                        <button
                          key={id}
                          onClick={() => setTextAlign(id)}
                          className={`p-2 sm:p-3 rounded-lg sm:rounded-xl border-2 transition-all duration-200 ${
                            textAlign === id
                              ? "bg-blue-100 border-blue-300 text-blue-700 scale-105"
                              : "bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
