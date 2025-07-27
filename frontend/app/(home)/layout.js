import NextTopLoader from "nextjs-toploader";
import "../globals.css";
import ClientThemeProvider from "@/providers/ThemeProvider";
import AuthGuard from "@/components/auth/AuthGuard";

export default function HomeLayout({ children }) {
  return (
    <ClientThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      themes={[
        "light",
        "dark",
        "purple",
        "blue",
        "green",
        "rose",
        "amber",
        "teal",
        "coral",
        "violet",
        "slate",
        "emerald",
      ]}
      disableTransitionOnChange
    >
      <NextTopLoader />
      <AuthGuard>
        {children}
      </AuthGuard>
    </ClientThemeProvider>
  );
}
