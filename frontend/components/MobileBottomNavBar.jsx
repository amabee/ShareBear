"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { cn } from "@/lib/utils";
import { navItems } from "@/constants/NavItems";

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t lg:hidden">
      <div className="flex items-center justify-around h-16 px-4">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "relative h-12 w-12",
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
      </div>
    </nav>
  );
}
