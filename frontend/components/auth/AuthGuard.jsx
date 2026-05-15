"use client";

// Auth is enforced at the edge by middleware.js.
// By the time this component renders, the user is guaranteed to be authenticated.
export default function AuthGuard({ children }) {
  return <>{children}</>;
}
