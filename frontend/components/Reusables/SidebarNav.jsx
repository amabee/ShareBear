"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare } from "lucide-react";
import { useSuggestionsStore } from "@/stores/useSuggestionsStore";

export function SidebarNav() {
  const { getActiveSuggestions } = useSuggestionsStore();
  const contacts = getActiveSuggestions().slice(0, 6);

  return (
    <div>
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
