"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { getNavItems } from "@/constants/NavItems";
import {
  MoreHorizontal,
  MessageCircle,
  Settings,
  LogOut,
  Palette,
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
import { useRouter } from "next/navigation";
import { useState, useCallback } from "react";
import { CreatePostModal } from "./Posts/CreatePostModal";

export function MobileBottomNav() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const navItems = getNavItems("angelzm");
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [lastPath, setLastPath] = useState(null);

  const handleCreateClick = useCallback(
    (e) => {
      e.preventDefault();
      setLastPath(pathname);
      setModalOpen(true);
      router.push(`${pathname}?modal=create`, { scroll: false });
    },
    [pathname, router]
  );

  const handleModalChange = useCallback(
    (open) => {
      setModalOpen(open);
      if (!open && lastPath) {
        router.push(lastPath, { scroll: false });
      }
    },
    [lastPath, router]
  );

  return (
    <TooltipProvider>
      <CreatePostModal open={modalOpen} onOpenChange={handleModalChange} />
      <nav className="fixed bottom-0 left-0 right-0  bg-background border-t z-20">
        <div className="flex items-center justify-around h-16 px-4 ">
          {navItems.map((item) => {
            if (item.href === "/create") {
              return (
                <Tooltip key={item.href}>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={cn(
                        "relative h-12 w-12 hover:cursor-pointer",
                        pathname === item.href && "text-primary"
                      )}
                      onClick={handleCreateClick}
                    >
                      <item.icon className="h-6 w-6" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p>{item.label || item.href.replace("/", "")}</p>
                  </TooltipContent>
                </Tooltip>
              );
            }
            return (
              <Tooltip key={item.href}>
                <TooltipTrigger asChild>
                  <Link href={item.href}>
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
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p>{item.label || item.href.replace("/", "")}</p>
                </TooltipContent>
              </Tooltip>
            );
          })}
          {/* More Dropdown */}
          <Tooltip>
            <DropdownMenu>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative h-12 w-12"
                  >
                    <MoreHorizontal className="h-6 w-6" />
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <DropdownMenuContent align="end" side="top" className="mb-2">
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
                <DropdownMenuItem className="flex items-center">
                  <LogOut className="mr-2 h-4 w-4" /> Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <TooltipContent side="top">
              <p>More</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </nav>
    </TooltipProvider>
  );
}
