import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Safely decode HTML entities (e.g. &#x27; → ') without dangerouslySetInnerHTML.
// Uses the browser's built-in DOMParser so it handles all named and numeric entities.
// Falls back to a regex map for SSR contexts where document is unavailable.
const ENTITY_MAP = {
  "&amp;": "&", "&lt;": "<", "&gt;": ">",
  "&quot;": '"', "&#x27;": "'", "&#x2F;": "/",
  "&#39;": "'", "&apos;": "'",
};

export function decodeHtmlEntities(str) {
  if (!str) return str;
  if (typeof document !== "undefined") {
    const txt = document.createElement("textarea");
    txt.innerHTML = str;
    return txt.value;
  }
  // SSR fallback
  return str.replace(/&[#\w]+;/g, (entity) => ENTITY_MAP[entity] ?? entity);
}
