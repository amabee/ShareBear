"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import {
  mockFollowers,
  mockFollowing,
  user,
  userPosts,
  userStats,
} from "@/data/userProfile";
import { ProfileHeader } from "./ShareBearProfile_Header";
import { ProfileStats } from "./ShareBearProfile_Stats";
import { ProfileTabs } from "./ShareBearProfile_Tabs";
import { ProfilePosts } from "./ShareBearProfile_Posts";
import { ProfileAbout } from "./ShareBearProfile_About";
import { ProfilePhotos } from "./ShareBearProfile_Photos";
import { ProfileVideos } from "./ShareBearProfile_Videos";
import { ProfileFollowList } from "./ShareBearProfile_FollowList";

export function ShareBearProfile({ userId, activePage = "posts" }) {
  const router = useRouter();
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState(activePage);

  useEffect(() => {
    setActiveTab(activePage);
  }, [activePage]);

  const handleTabChange = (value) => {
    setActiveTab(value);
    if (value === "posts") {
      router.push(`/profile/${userId}`);
    } else {
      router.push(`/profile/${userId}?page=${value}`);
    }
  };

  const handleFollowToggle = () => {
    setIsFollowing(!isFollowing);
  };

  const handleFollowersClick = () => {
    router.push(`/profile/${userId}?page=followers`);
  };

  const handleFollowingClick = () => {
    router.push(`/profile/${userId}?page=following`);
  };

  const handleFollowListToggle = (targetUserId) => {
    console.log(`Toggle follow for user ${targetUserId}`);
    // Handle follow/unfollow logic here
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Profile Header */}
      <ProfileHeader
        user={user}
        isFollowing={isFollowing}
        onFollowToggle={handleFollowToggle}
        onFollowersClick={handleFollowersClick}
        onFollowingClick={handleFollowingClick}
      />

      {/* Stats Cards */}
      <ProfileStats stats={userStats} />

      {/* Content Tabs */}
      <ProfileTabs activeTab={activeTab} onTabChange={handleTabChange} />

      {/* Tab Content */}
      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="w-full"
      >
        <TabsContent value="posts" className="p-2">
          <ProfilePosts posts={userPosts} />
        </TabsContent>

        <TabsContent value="about" className="p-6">
          <ProfileAbout user={user} />
        </TabsContent>

        <TabsContent value="photos" className="p-6">
          <ProfilePhotos
            posts={userPosts.filter((post) => post.type === "image")}
          />
        </TabsContent>

        <TabsContent value="videos" className="p-6">
          <ProfileVideos
            posts={userPosts.filter(
              (post) => post.type === "video" || post.type === "reel"
            )}
          />
        </TabsContent>

        <TabsContent value="followers" className="p-6">
          <ProfileFollowList
            users={mockFollowers}
            title="Followers"
            onFollowToggle={handleFollowListToggle}
          />
        </TabsContent>

        <TabsContent value="following" className="p-6">
          <ProfileFollowList
            users={mockFollowing}
            title="Following"
            onFollowToggle={handleFollowListToggle}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
