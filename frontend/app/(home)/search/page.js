"use client";

import { useState } from "react";
import { HomePageLayout } from "@/components/Reusables/HomePageLayout";
import TopNavBar from "@/components/Reusables/TopNavBar";
import SearchHeader from "@/components/search/SearchHeader";
import VideoGrid from "@/components/search/VideoGrid";
import SearchModal from "@/components/search/SearchModal";

export default function SearchPage() {
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const handleSearchFocus = () => {
    setIsSearchModalOpen(true);
  };

  const handleSearchChange = (value) => {
    setSearchValue(value);
  };

  const handleCloseModal = () => {
    setIsSearchModalOpen(false);
    setSearchValue("");
  };

  return (
    <HomePageLayout>
      <TopNavBar />
      <div className="max-w-7xl mx-auto">
        <SearchHeader
          onSearchFocus={handleSearchFocus}
          onSearchChange={handleSearchChange}
          searchValue={searchValue}
          isSearching={isSearchModalOpen}
        />

        <VideoGrid />

        <SearchModal
          isOpen={isSearchModalOpen}
          onClose={handleCloseModal}
          searchValue={searchValue}
          onSearchChange={handleSearchChange}
        />
      </div>
    </HomePageLayout>
  );
}
