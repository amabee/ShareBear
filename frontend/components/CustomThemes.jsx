import { Sun, Moon, Laptop, Sparkles, Zap, Leaf, Heart } from "lucide-react";
export const themes = [
  { name: "light", label: "Light", icon: Sun, color: "bg-white" },
  { name: "dark", label: "Dark", icon: Moon, color: "bg-gray-900" },
  {
    name: "system",
    label: "System",
    icon: Laptop,
    color: "bg-gradient-to-r from-gray-400 to-gray-600",
  },
  {
    name: "purple",
    label: "Purple",
    icon: Sparkles,
    color: "bg-gradient-to-r from-purple-500 to-pink-500",
  },
  {
    name: "blue",
    label: "Ocean",
    icon: Zap,
    color: "bg-gradient-to-r from-blue-500 to-cyan-500",
  },
  {
    name: "green",
    label: "Nature",
    icon: Leaf,
    color: "bg-gradient-to-r from-green-500 to-emerald-500",
  },
  {
    name: "rose",
    label: "Rose",
    icon: Heart,
    color: "bg-gradient-to-r from-rose-500 to-pink-500",
  },
];
