"use client";

import { useState } from "react";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  MapPin,
  LinkIcon,
  Calendar,
  Heart,
  MessageCircle,
  Camera,
  Star,
  Award,
  Zap,
  Target,
  Users,
  MoreHorizontal,
  UserPlus,
  FileText,
  Video,
  PlaySquare,
  ImageIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { userPosts, userStats } from "@/data/userProfile";
import { AspectRatio } from "./ui/aspect-ratio";
import { formatCount } from "@/utils/formatCount";

export function ShareBearProfile() {
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState("posts");

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <Card
        className="overflow-hidden p-0 
      border-b-1 
      border-l-0 
      border-t-0 
      border-r-0 
      rounded-t-lg
      rounded-b-none
      shadow-none"
      >
        {/* Cover Photo */}
        <div className="relative h-80 bg-gradient-to-br from-primary/20 via-purple-500/20 to-pink-500/20">
          <Image
            src="https://images.hdqwalls.com/wallpapers/elizabeth-olsen-as-scarlet-witch-in-wanda-vision-4k-of.jpg"
            alt="Cover"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

          {/* Cover Photo Edit Button */}
          <Button
            size="sm"
            className="absolute bottom-4 right-4
             bg-background/90 text-foreground hover:bg-background hover:cursor-pointer z-50"
          >
            <Camera className="h-4 w-4 mr-2" />
            Edit Cover
          </Button>
        </div>

        {/* Profile Info Section */}
        <CardContent className="relative px-6 pb-6">
          {/* Profile Picture - Overlapping cover */}
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6 -mt-20 relative z-10">
            <div className="relative group">
              <div className="absolute -inset-1 rounded-full blur" />
              <Avatar className="relative h-40 w-40 border-transparent">
                <AvatarImage
                  src="/placeholder.svg?height=160&width=160"
                  alt="John Doe"
                />
                <AvatarFallback className="text-4xl">JD</AvatarFallback>
              </Avatar>
              <Button
                size="icon"
                className="absolute bottom-2 right-2 h-10 w-10 
                border-2 rounded-full bg-muted hover:bg-muted/80 hover:cursor-pointer"
              >
                <Camera className="h-5 w-5 dark:text-gray-400 text-gray-500" />
              </Button>
            </div>

            {/* Name and Basic Info */}
            <div className="flex-1 pt-4 sm:pt-0">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold">John Doe</h1>
                    <Badge
                      variant="secondary"
                      className="bg-primary/10 text-primary"
                    >
                      <Award className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  </div>
                  <p className="text-muted-foreground text-lg mb-2">@johndoe</p>
                  <p className="text-sm text-muted-foreground">
                    <strong>12.5K</strong> followers • <strong>892</strong>{" "}
                    following
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button
                    onClick={() => setIsFollowing(!isFollowing)}
                    className={cn(
                      "min-w-[100px]",
                      isFollowing
                        ? "bg-primary/80 hover:bg-destructive hover:text-destructive-foreground"
                        : "bg-primary hover:bg-primary/90"
                    )}
                  >
                    {isFollowing ? (
                      <>
                        <UserPlus className="h-4 w-4 mr-2" />
                        Following
                      </>
                    ) : (
                      <>
                        <UserPlus className="h-4 w-4 mr-2" />
                        Follow
                      </>
                    )}
                  </Button>
                  <Button variant="outline">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Message
                  </Button>
                  <Button variant="outline" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Bio and Details */}
          <div className="mt-6 space-y-4">
            <p className="text-foreground/80 max-w-3xl leading-relaxed">
              ✨ Digital creator sharing life's moments • 📸 Photography
              enthusiast • 🌍 Exploring the world one post at a time • 💭
              Spreading positivity through memes and memories
            </p>

            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>San Francisco, CA</span>
              </div>
              <div className="flex items-center gap-2">
                <LinkIcon className="h-4 w-4" />
                <span className="text-primary hover:underline cursor-pointer">
                  johndoe.com
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>Joined March 2023</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {userStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card
              key={stat.label}
              className="group rounded-none 
              border-t-0 border-b-0 shadow-none 
              transition-all duration-200 cursor-pointer"
            >
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <div className="p-2 rounded-full">
                    <Icon className={cn("h-6 w-6", stat.color)} />
                  </div>
                </div>
                <div className="text-xl font-bold mb-1">{stat.value}</div>
                <div className="text-xs text-muted-foreground">
                  {stat.label}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Content Tabs */}
      <Card className="pt-2 border-l-0 border-r-0 rounded-none shadow-none">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="px-6">
            <TabsList className="h-12 bg-transparent flex w-full border-0 p-0">
              <TabsTrigger
                value="posts"
                className="flex-1 flex items-center justify-center gap-2 text-base
                 py-2 rounded-none bg-transparent border-0 shadow-none
                 data-[state=active]:bg-transparent data-[state=active]:border-b-2
                 data-[state=active]:border-primary data-[state=active]:shadow-none
                 hover:bg-transparent focus:bg-transparent"
              >
                <Camera className="h-4 w-4" />
                Posts
              </TabsTrigger>
              <TabsTrigger
                value="about"
                className="flex-1 flex items-center justify-center gap-2 text-base 
                py-2 rounded-none bg-transparent border-0 shadow-none
                data-[state=active]:bg-transparent data-[state=active]:border-b-2 
                data-[state=active]:border-primary data-[state=active]:shadow-none
                hover:bg-transparent focus:bg-transparent"
              >
                <Target className="h-4 w-4" />
                About
              </TabsTrigger>
              <TabsTrigger
                value="photos"
                className="flex-1 flex items-center justify-center gap-2 text-base 
                py-2 rounded-none bg-transparent border-0 shadow-none
                data-[state=active]:bg-transparent data-[state=active]:border-b-2 
                data-[state=active]:border-primary data-[state=active]:shadow-none
                hover:bg-transparent focus:bg-transparent"
              >
                <Camera className="h-4 w-4" />
                Photos
              </TabsTrigger>
              <TabsTrigger
                value="videos"
                className="flex-1 flex items-center justify-center gap-2 text-base 
                py-2 rounded-none bg-transparent border-0 shadow-none
                data-[state=active]:bg-transparent data-[state=active]:border-b-2 
                data-[state=active]:border-primary data-[state=active]:shadow-none
                hover:bg-transparent focus:bg-transparent"
              >
                <Zap className="h-4 w-4" />
                Videos
              </TabsTrigger>
            </TabsList>
          </div>

          {/* POST SECTION */}
          <TabsContent value="posts" className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {userPosts.map((post) => (
                <Card
                  key={post.id}
                  className="group overflow-hidden cursor-pointer 
                            hover:shadow-lg transition-all p-0 rounded-md"
                >
                  {post.type === "text" ? (
                    // Text post layout
                    <AspectRatio ratio={4 / 5}>
                      <div
                        className="relative w-full h-full flex items-center justify-center p-6 overflow-hidden"
                        style={{
                          background:
                            post.backgroundColor || post.backgroundImage
                              ? post.backgroundImage
                                ? `url(${post.backgroundImage})`
                                : post.backgroundColor
                              : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                          backgroundRepeat: "no-repeat",
                        }}
                      >
                        {/* Background overlay for better text readability */}
                        <div className="absolute inset-0 bg-black/20" />

                        {/* Text content */}
                        <div className="relative z-10 text-center">
                          <p className="text-white text-base font-medium leading-relaxed drop-shadow-lg line-clamp-6">
                            {post.content}
                          </p>
                        </div>

                        {/* Badge at top right */}
                        <Badge className="absolute top-2 right-2">
                          <FileText className="h-3 w-3 mr-1" />
                          Text
                        </Badge>

                        {/* Hover overlay with engagement stats */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                        <div
                          className="absolute inset-0 flex items-center justify-center 
                          opacity-0 group-hover:opacity-100 transition-opacity z-20"
                        >
                          <div className="flex items-center gap-4 text-white">
                            <div className="flex items-center gap-1">
                              <Heart className="h-5 w-5" />
                              <span className="font-bold">
                                {formatCount(post.likes)}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MessageCircle className="h-5 w-5" />
                              <span className="font-bold">
                                {formatCount(post.comments)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </AspectRatio>
                  ) : (
                    <AspectRatio ratio={4 / 5}>
                      <div className="relative w-full h-full">
                        <Image
                          src={post.image || "/placeholder.svg"}
                          alt="Post"
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors" />
                        <div
                          className="absolute inset-0 flex items-center justify-center 
                                    opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                              <Heart className="h-5 w-5 text-white" />
                              <span className="font-bold text-white">
                                {formatCount(post.likes)}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MessageCircle className="h-5 w-5 text-white" />
                              <span className="font-bold text-white">
                                {formatCount(post.comments)}
                              </span>
                            </div>
                          </div>
                        </div>
                        {post.type === "video" && (
                          <Badge className="absolute top-2 right-2 ">
                            <Video className="h-3 w-3 mr-1" />
                            Video
                          </Badge>
                        )}
                        {post.type === "reel" && (
                          <Badge className="absolute top-2 right-2">
                            <PlaySquare className="h-3 w-3 mr-1" />
                            Reel
                          </Badge>
                        )}
                        {post.type === "image" && (
                          <Badge className="absolute top-2 right-2 ">
                            <ImageIcon className="h-3 w-3 mr-1" />
                            Image
                          </Badge>
                        )}
                      </div>
                    </AspectRatio>
                  )}
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* ABOUT SECTION */}
          <TabsContent value="about" className="p-6">
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-3">About John</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Passionate digital creator and photography enthusiast based in
                  San Francisco. I love capturing life's beautiful moments and
                  sharing them with the world. When I'm not behind the camera,
                  you can find me exploring new places, trying different
                  cuisines, or creating memes that make people smile.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Interests</h3>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Photography",
                    "Travel",
                    "Food",
                    "Technology",
                    "Art",
                    "Music",
                  ].map((interest) => (
                    <Badge key={interest} variant="secondary">
                      {interest}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* PHOTOS SECTION */}
          <TabsContent value="photos" className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {userPosts
                .filter((post) => post.type === "image")
                .map((post) => (
                  <AspectRatio
                    key={post.id}
                    ratio={4 / 5}
                    className="overflow-hidden rounded-lg"
                  >
                    <Image
                      src={post.image || "/placeholder.svg"}
                      alt="Photo"
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </AspectRatio>
                ))}
            </div>
          </TabsContent>

          {/* VIDEOS SECTION */}
          <TabsContent value="videos" className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {userPosts
                .filter((post) => post.type === "video" || post.type === "reel")
                .map((post) => (
                  <Card key={post.id} className="overflow-hidden p-0">
                    <AspectRatio ratio={4 / 5}>
                      <div className="relative w-full h-full">
                        <Image
                          src={post.image || "/placeholder.svg"}
                          alt="Video"
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-12 h-12 bg-black/50 rounded-full flex items-center justify-center">
                            <div className="w-0 h-0 border-l-[8px] border-l-white border-y-[6px] border-y-transparent ml-1" />
                          </div>
                        </div>
                        <Badge className="absolute top-2 right-2 bg-black/50 text-white">
                          {post.type === "reel" ? "Reel" : "Video"}
                        </Badge>
                      </div>
                    </AspectRatio>
                  </Card>
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
