import { CheckCircle } from "lucide-react";
import { useMemo } from "react";

const UserInfo = ({ user, timestamp, location }) => {
  const displayName = useMemo(() => {
    return user?.displayName
      ? user.displayName
      : [
          user?.userInfo?.firstName,
          user?.userInfo?.middleName,
          user?.userInfo?.lastName,
        ]
          .filter(Boolean)
          .join(" ");
  }, [user]);

  return (
    <div>
      <div className="flex items-center space-x-1">
        <span className="font-semibold text-sm">{displayName}</span>
        {user?.verified && (
          <CheckCircle className="h-3 w-3 text-blue-500 fill-current" />
        )}
      </div>

      {user?.username && (
        <div className="text-xs text-muted-foreground leading-none mt-1">
          @{user.username}
        </div>
      )}

      <div className="flex items-center space-x-2 text-xs text-muted-foreground mt-1">
        <span>{timestamp}</span>
        {location && (
          <>
            <span>•</span>
            <span>{location}</span>
          </>
        )}
      </div>
    </div>
  );
};

export default UserInfo;
