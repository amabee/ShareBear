"use client";
import { ThemeProvider } from "next-themes";

function ClientThemeProvider({ children, ...props }) {
  return <ThemeProvider {...props}>{children}</ThemeProvider>;
}

export default ClientThemeProvider;
