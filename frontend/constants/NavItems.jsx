import {
  Home,
  Search,
  PlusSquare,
  Heart,
  User,
  PlaySquare,
} from "lucide-react";
const notificationCount = 3;
export const navItems = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/search", icon: Search, label: "Search" },
  { href: "/reels", icon: PlaySquare, label: "Reels" },
  { href: "/create", icon: PlusSquare, label: "Create" },
  {
    href: "/notifications",
    icon: Heart,
    label: "Notifications",
    badge: notificationCount,
  },
  { href: "/profile", icon: User, label: "Profile" },
];
