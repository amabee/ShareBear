import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";

const UserAvatar = ({ user }) => {
  return (
    <Avatar className="h-9 w-9 ring-2 ring-background">
      <AvatarImage
        src={user?.avatar || "/placeholder.svg"}
        alt={user?.displayName}
        className="object-cover"
      />
      <AvatarFallback className="font-semibold text-sm bg-gradient-to-br from-primary/20 to-primary/40 text-primary">
        {(user?.displayName?.charAt(0) ||
          user?.userInfo?.firstName?.charAt(0) ||
          "?").toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
