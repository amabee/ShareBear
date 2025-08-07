import React, { useMemo } from "react";

const CaptionsWithHashtags = ({ caption }) => {
  const renderedCaption = useMemo(() => {
    const parts = caption.split(/(#\w+)/g);
    return parts.map((part, index) => {
      if (part.startsWith("#")) {
        return (
          <span
            key={index}
            className="text-blue-600 font-medium hover:text-blue-700 cursor-pointer"
          >
            {part}
          </span>
        );
      }
      return <span key={index}>{part}</span>;
    });
  }, [caption]);

  return <span className="text-sm">{renderedCaption}</span>;
};

export default CaptionsWithHashtags;
