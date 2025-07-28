import dynamic from "next/dynamic";

const Suggestions = dynamic(() => import("../Suggestions"), {
  loading: () => <div className="h-96 bg-gray-100 animate-pulse rounded-lg" />,
});

export default Suggestions;
