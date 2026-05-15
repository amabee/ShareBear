"use client";
import { MobileBottomNav } from "./MobileBottomNavbar";

export function HomePageLayout({ children }) {
  return (
    <div className="min-h-screen bg-background">
      {/* pt-[104px]: accounts for navbar top row (56px) + tabs row (~48px) */}
      <main className="pt-[104px] pb-20 lg:pb-6">{children}</main>
      <MobileBottomNav />
    </div>
  );
}

