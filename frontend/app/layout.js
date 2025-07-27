import { Poppins } from "next/font/google";
import "./globals.css";
import SessionProvider from "@/providers/SessionProvider";
import QueryProvider from "@/providers/QueryProvider";
import { getServerSession } from "next-auth";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  title: "ShareBear",
  description: "Share memes, memories, and moments with friends",
};

export default async function RootLayout({ children }) {
  const session = await getServerSession();

  return (
    <html lang="en">
      <body
        className={`${poppins.variable} antialiased`}
        suppressHydrationWarning
      >
        <QueryProvider>
          <SessionProvider session={session}>
            {children}
          </SessionProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
