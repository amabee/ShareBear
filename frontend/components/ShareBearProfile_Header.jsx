"use client";

import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  LinkIcon,
  Calendar,
  MessageCircle,
  Camera,
  Award,
  MoreHorizontal,
  UserPlus,
  Plus,
  PlayIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function ProfileHeader({
  user,
  isFollowing,
  onFollowToggle,
  onFollowersClick,
  onFollowingClick,
}) {
  return (
    <Card className="overflow-hidden p-0 border-b-1 border-l-0 border-t-0 border-r-0 rounded-t-lg rounded-b-none shadow-none">
      {/* Cover Photo */}
      <div className="relative h-80 bg-gradient-to-br from-primary/20 via-purple-500/20 to-pink-500/20">
        <Image
          src={user.coverImage}
          alt="Cover"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

        <Button
          size="sm"
          className="absolute bottom-4 right-4 bg-background/90 text-foreground hover:bg-background hover:cursor-pointer z-50"
        >
          <Camera className="h-4 w-4 mr-2" />
          Edit Cover
        </Button>
      </div>

      {/* Profile Info Section */}
      <CardContent className="relative px-6 pb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6 -mt-20 relative z-10">
          {/* Profile Picture */}
          <div className="relative group">
            <div className="absolute -inset-1 rounded-full blur" />
            <Avatar className="relative h-40 w-40 border-transparent">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="text-4xl">
                {user.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <Button
              size="icon"
              className="absolute bottom-2 right-2 h-10 w-10 border-2 rounded-full bg-muted hover:bg-muted/80 hover:cursor-pointer"
            >
              <Camera className="h-5 w-5 dark:text-gray-400 text-gray-500" />
            </Button>
          </div>

          {/* Name and Basic Info */}
          <div className="flex-1 pt-4 sm:pt-0">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold">{user.name}</h1>
                  {user.isVerified && (
                    <Badge
                      variant="secondary"
                      className="bg-primary/10 text-primary"
                    >
                      <Award className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>
                <p className="text-muted-foreground text-lg mb-2">
                  @{user.username}
                </p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <button
                    onClick={onFollowersClick}
                    className="hover:text-primary cursor-pointer"
                  >
                    <strong>{user.followersCount}</strong> followers
                  </button>
                  <button
                    onClick={onFollowingClick}
                    className="hover:text-primary cursor-pointer"
                  >
                    <strong>{user.followingCount}</strong> following
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              {/* <div className="flex gap-3">
                <Button
                  onClick={onFollowToggle}
                  className={cn(
                    "min-w-[100px]",
                    isFollowing
                      ? "bg-primary/80 hover:bg-destructive hover:text-destructive-foreground"
                      : "bg-primary hover:bg-primary/90"
                  )}
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  {isFollowing ? "Following" : "Follow"}
                </Button>
                <Button variant="outline">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Message
                </Button>
                <Button variant="outline" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div> */}
              <div className="flex gap-3">
                <Button variant="default" className="hover:cursor-pointer">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Story
                </Button>
                <Button variant="outline" className="hover:cursor-pointer">
                  <PlayIcon className="h-4 w-4 mr-2" />
                  Add Reel
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Bio and Details */}
        <div className="mt-6 space-y-4">
          <p className="text-foreground/80 max-w-3xl leading-relaxed">
            {user.bio}
          </p>

          <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
            {user.location && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>{user.location}</span>
              </div>
            )}
            {user.website && (
              <div className="flex items-center gap-2">
                <LinkIcon className="h-4 w-4" />
                <span className="text-primary hover:underline cursor-pointer">
                  {user.website}
                </span>
              </div>
            )}
            {user.joinDate && (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>Joined {user.joinDate}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
