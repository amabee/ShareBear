"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, MoreHorizontal, Filter } from "lucide-react";
import { cn } from "@/lib/utils";

export function ConversationList({ 
  conversations, 
  selectedConversation, 
  onSelectConversation,
  onSearch 
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const filteredConversations = conversations.filter(conversation =>
    conversation.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conversation.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case "online": return "bg-green-500";
      case "away": return "bg-yellow-500";
      case "busy": return "bg-red-500";
      default: return "bg-gray-400";
    }
  };

  const getUnreadCount = (conversation) => {
    // Simulate unread count
    return conversation.unread ? Math.floor(Math.random() * 5) + 1 : 0;
  };

  return (
    <div className="lg:col-span-1 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Messages
          </h2>
          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="hover:bg-slate-100 dark:hover:bg-slate-700"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="hover:bg-slate-100 dark:hover:bg-slate-700">
              <MoreHorizontal className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input 
            placeholder="Search conversations..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900">
                All
              </Badge>
              <Badge variant="outline" className="cursor-pointer">
                Unread
              </Badge>
              <Badge variant="outline" className="cursor-pointer">
                Online
              </Badge>
            </div>
          </div>
        )}
      </div>
      
      {/* Conversations */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          {filteredConversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mb-4">
                <Search className="h-8 w-8 text-slate-400" />
              </div>
              <p className="text-slate-600 dark:text-slate-400 font-medium">
                No conversations found
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">
                Try adjusting your search terms
              </p>
            </div>
          ) : (
            filteredConversations.map((conversation) => {
              const unreadCount = getUnreadCount(conversation);
              return (
                <div
                  key={conversation.id}
                  onClick={() => onSelectConversation(conversation)}
                  className={cn(
                    "group flex items-center space-x-3 p-4 rounded-xl cursor-pointer transition-all duration-200 hover:bg-slate-50 dark:hover:bg-slate-700/50 mb-2 relative overflow-hidden",
                    selectedConversation.id === conversation.id
                      ? "bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-700"
                      : ""
                  )}
                >
                  {/* Selection indicator */}
                  {selectedConversation.id === conversation.id && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-purple-600"></div>
                  )}
                  
                  <div className="relative">
                    <Avatar className="h-12 w-12 ring-2 ring-white dark:ring-slate-800">
                      <AvatarImage
                        src={conversation.user.avatar || "/placeholder.svg"}
                        alt={conversation.user.name}
                      />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                        {conversation.user.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className={cn(
                      "absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-slate-800",
                      getStatusColor(conversation.user.status || "offline")
                    )} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
                        {conversation.user.name}
                      </p>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {conversation.timestamp}
                      </span>
                    </div>
                    <p
                      className={cn(
                        "text-sm truncate",
                        conversation.unread
                          ? "font-medium text-slate-900 dark:text-slate-100"
                          : "text-slate-600 dark:text-slate-400"
                      )}
                    >
                      {conversation.lastMessage}
                    </p>
                  </div>
                  
                  {conversation.unread && (
                    <div className="flex flex-col items-end space-y-1">
                      <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-pulse"></div>
                      {unreadCount > 0 && (
                        <Badge 
                          variant="secondary" 
                          className="text-xs px-2 py-0.5 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 min-w-[20px] justify-center"
                        >
                          {unreadCount}
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </ScrollArea>
    </div>
  );
} 
