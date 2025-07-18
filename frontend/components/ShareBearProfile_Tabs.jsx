"use client";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { tabs } from "@/constants/ProfileTabs";

export function ProfileTabs({ activeTab, onTabChange }) {
  return (
    <Card className="border-l-0 border-r-0 border-b-0 rounded-none shadow-none">
      <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
        <div className="px-6">
          <TabsList className="h-12 bg-transparent flex w-full border-0 p-0">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="flex-1 flex items-center justify-center gap-2 text-base
                   py-2 rounded-none bg-transparent border-0 shadow-none
                   data-[state=active]:bg-transparent data-[state=active]:border-b-2
                   data-[state=active]:border-primary data-[state=active]:shadow-none
                   hover:bg-transparent focus:bg-transparent"
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </TabsTrigger>
              );
            })}
          </TabsList>
        </div>
      </Tabs>
    </Card>
  );
}
