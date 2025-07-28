import dynamic from "next/dynamic";
import NextTopLoader from "nextjs-toploader";
import AuthGuard from "@/components/auth/AuthGuard";

// Lazy load theme provider to reduce initial bundle
const ClientThemeProvider = dynamic(() => import("@/providers/ThemeProvider"), {
  loading: () => <div style={{ visibility: "hidden" }} />,
});

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
      <NextTopLoader 
        color="#3b82f6"
        height={3}
        showSpinner={false}
        easing="ease"
        speed={200}
      />
      <AuthGuard>
        {children}
      </AuthGuard>
    </ClientThemeProvider>
  );
}
