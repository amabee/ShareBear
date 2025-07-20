import NextTopLoader from "nextjs-toploader";
import "../globals.css";
import ClientThemeProvider from "@/providers/ThemeProvider";

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
      {children}
    </ClientThemeProvider>
  );
}
