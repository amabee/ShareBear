"use client";
import { useEffect, useState } from "react";
import { ThemeProvider } from "next-themes";

function ClientThemeProvider({ children, ...props }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div style={{ visibility: "hidden" }}>{children}</div>;
  }

  return <ThemeProvider {...props}>{children}</ThemeProvider>;
}

export default ClientThemeProvider;
