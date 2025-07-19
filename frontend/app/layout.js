import { Poppins } from "next/font/google";
import "./globals.css";
import ClientThemeProvider from "@/providers/ThemeProvider";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  title: "ShareBear",
  description: "Share memes, memories, and moments with friends",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} antialiased`}
        suppressHydrationWarning
      >
         {children}
      </body>
    </html>
  );
}
