import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";

const UserAvatar = ({ user }) => {
  <Avatar className="h-10 w-10">
    <AvatarImage
      src={user?.avatar || "/placeholder.svg"}
      alt={user?.displayName}
    />
    <AvatarFallback className="font-medium text-slate-600">
      {user?.displayName?.charAt(0) ||
        user?.userInfo?.firstName?.charAt(0) +
          user?.userInfo?.lastName?.charAt(0)}
    </AvatarFallback>
  </Avatar>;
};

export default UserAvatar;
