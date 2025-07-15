"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit3, TrendingUp } from "lucide-react";

export function ProfileCard() {
  return (
    <Card className="sticky top-20">
      <CardContent className="p-4">
        <div className="flex items-center space-x-3 mb-4">
          <div className="relative">
            <Avatar className="h-12 w-12">
              <AvatarImage
                src="/placeholder.svg?height=48&width=48"
                alt="Your profile"
              />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-background rounded-full"></div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm truncate">John Doe</p>
            <p className="text-xs text-muted-foreground truncate">@johndoe</p>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Edit3 className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Profile views</span>
            <div className="flex items-center gap-1 text-primary">
              <TrendingUp className="h-3 w-3" />
              <span className="font-medium">127</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Post impressions</span>
            <div className="flex items-center gap-1 text-green-500">
              <TrendingUp className="h-3 w-3" />
              <span className="font-medium">2.1K</span>
            </div>
          </div>

          <div className="pt-2 border-t">
            <Badge
              variant="secondary"
              className="w-full justify-center bg-primary/10 text-primary hover:bg-primary/20"
            >
              Premium Member
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
