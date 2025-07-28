import { Poppins } from "next/font/google";
import "./globals.css";
import SessionProvider from "@/providers/SessionProvider";
import QueryProvider from "@/providers/QueryProvider";
import { Toaster } from "react-hot-toast";
import { getServerSession } from "next-auth";
import PerformanceMonitor from "@/components/PerformanceMonitor";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  preload: true,
  fallback: ["system-ui", "arial"],
});

export const metadata = {
  title: "ShareBear",
  description: "Share memes, memories, and moments with friends",
  metadataBase: new URL(process.env.NEXTAUTH_URL || "http://localhost:3000"),
  openGraph: {
    title: "ShareBear",
    description: "Share memes, memories, and moments with friends",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ShareBear",
    description: "Share memes, memories, and moments with friends",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default async function RootLayout({ children }) {
  const session = await getServerSession();

  return (
    <html lang="en" className={poppins.variable}>
      <head>
        {/* Preload critical resources */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="//api.unsplash.com" />
        <link rel="dns-prefetch" href="//images.unsplash.com" />
        
        {/* Preload critical CSS */}
        <link rel="preload" href="/globals.css" as="style" />
        
        {/* Preload critical images if any */}
        <link rel="preload" href="/next.svg" as="image" type="image/svg+xml" />
      </head>
      <body
        className="antialiased"
        suppressHydrationWarning
      >
        <QueryProvider>
          <SessionProvider session={session}>
            {children}
            <Toaster />
            <PerformanceMonitor />
          </SessionProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
