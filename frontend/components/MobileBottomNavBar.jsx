"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { cn } from "@/lib/utils";
import { getNavItems, navItems } from "@/constants/NavItems";
import {
  MoreHorizontal,
  Play,
  MessageCircle,
  Settings,
  LogOut,
  Palette,
  User,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "next-themes";
import { themes } from "./CustomThemes";

export function MobileBottomNav() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const navItems = getNavItems("angelzm");

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t ">
      <div className="flex items-center justify-around h-16 px-4 ">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "relative h-12 w-12 hover:cursor-pointer",
                pathname === item.href && "text-primary"
              )}
            >
              <item.icon className="h-6 w-6" />
              {item.badge && item.badge > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                >
                  {item.badge}
                </Badge>
              )}
            </Button>
          </Link>
        ))}
        {/* More Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative h-12 w-12">
              <MoreHorizontal className="h-6 w-6" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" side="top" className="mb-2">
            <DropdownMenuItem asChild>
              <Link href="/reels" className="flex items-center">
                <Play className="mr-2 h-4 w-4" /> Reels
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/messages" className="flex items-center">
                <MessageCircle className="mr-2 h-4 w-4" /> Messages
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings" className="flex items-center">
                <Settings className="mr-2 h-4 w-4" /> Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {/* Theme Submenu */}
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <Palette className="mr-2 h-4 w-4" /> Theme
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                {themes.map((themeOption) => {
                  const Icon = themeOption.icon;
                  return (
                    <DropdownMenuItem
                      key={themeOption.name}
                      onClick={() => setTheme(themeOption.name)}
                      className="flex items-center gap-3 cursor-pointer"
                    >
                      <div
                        className={`w-4 h-4 rounded-full ${themeOption.color}`}
                      />
                      <Icon className="h-4 w-4" />
                      <span>{themeOption.label}</span>
                      {theme === themeOption.name && (
                        <span className="ml-auto">✓</span>
                      )}
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/profile" className="flex items-center">
                <User className="mr-2 h-4 w-4" /> Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center">
              <LogOut className="mr-2 h-4 w-4" /> Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
}
