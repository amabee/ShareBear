import dynamic from "next/dynamic";

const ProfileCard = dynamic(() => import("../ProfileCard"), {
  loading: () => <div className="h-96 bg-gray-100 animate-pulse rounded-lg" />,
});

export default ProfileCard;
