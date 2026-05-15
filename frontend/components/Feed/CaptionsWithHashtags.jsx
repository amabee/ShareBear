"use client";
import React, { useMemo, useState } from "react";

const CaptionsWithHashtags = ({ caption, expandable = false }) => {
  const [expanded, setExpanded] = useState(false);
  const CHAR_LIMIT = 160;
  const shouldTruncate = expandable && !expanded && caption.length > CHAR_LIMIT;
  const display = shouldTruncate ? caption.slice(0, CHAR_LIMIT) : caption;

  const rendered = useMemo(() => {
    return display.split(/(#\w+)/g).map((part, i) =>
      part.startsWith("#") ? (
        <span key={i} className="text-blue-500 dark:text-blue-400 font-medium hover:underline cursor-pointer">
          {part}
        </span>
      ) : (
        <span key={i}>{part}</span>
      )
    );
  }, [display]);

  return (
    <span className="text-sm leading-relaxed">
      {rendered}
      {shouldTruncate && (
        <>
          {"… "}
          <button
            onClick={() => setExpanded(true)}
            className="text-muted-foreground hover:text-foreground text-sm font-semibold"
          >
            more
          </button>
        </>
      )}
    </span>
  );
};

export default CaptionsWithHashtags;

