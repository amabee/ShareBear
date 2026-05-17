"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Home,
  Search,
  Heart,
  MessageCircle,
  PlaySquare,
  BarChart3,
  MessageSquare,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSuggestionsStore } from "@/stores/useSuggestionsStore";

const NAV_ITEMS = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/search", icon: Search, label: "Explore" },
  { href: "/notifications", icon: Heart, label: "Favorites" },
  { href: "/messages", icon: MessageCircle, label: "Messages" },
  { href: "/reels", icon: PlaySquare, label: "Reels" },
  { href: "/stats", icon: BarChart3, label: "Stats" },
];

export function SidebarNav() {
  const pathname = usePathname();
  const { getActiveSuggestions } = useSuggestionsStore();
  const contacts = getActiveSuggestions().slice(0, 6);

  return (
    <div className="space-y-5">
      {/* Navigation links */}
      <nav className="space-y-0.5">
        {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
          const isActive =
            href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150",
                isActive
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <Icon className="h-[18px] w-[18px] shrink-0" />
              {label}
            </Link>
          );
        })}

      </nav>

      {/* Contacts — populated once Suggestions loads */}
      {contacts.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide px-3">
            Contacts
          </p>
          <div className="space-y-0.5">
            {contacts.map((user) => (
              <div
                key={user.userId}
                className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-muted transition-colors cursor-pointer group"
              >
                <div className="relative shrink-0">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar} className="object-cover" />
                    <AvatarFallback className="text-xs font-semibold">
                      {user.userInfo?.firstName?.[0]}
                      {user.userInfo?.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-green-500 ring-1 ring-background" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold truncate">
                    {user.userInfo?.firstName} {user.userInfo?.lastName}
                  </p>
                  <p className="text-[10px] text-muted-foreground truncate">
                    @{user.username}
                  </p>
                </div>
                <MessageSquare className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
