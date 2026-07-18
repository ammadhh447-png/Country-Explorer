import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Providers } from "@/components/providers";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: "Country Explorer — Explore Every Country in the World",
  description:
    "Discover countries through interactive maps, live statistics, demographics, economy, culture, and comparisons.",
  keywords: ["countries", "world map", "statistics", "travel", "geography"],
};

const themeScript = `(function(){try{var d=document.documentElement,s=d.style;s.colorScheme="dark";d.classList.remove("light","dark");var t=localStorage.getItem("theme");if(t==="system"||!t){t=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}else if(t!=="light"&&t!=="dark"){t="dark"}d.classList.add(t);s.colorScheme=t}catch(e){document.documentElement.classList.add("dark")}})();`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body
        suppressHydrationWarning
        className={`${inter.variable} ${playfair.variable} antialiased flex flex-col min-h-screen`}
      >
        <Providers>
          <div className="flex flex-col min-h-screen w-full min-w-0 overflow-x-clip">
            <Header />
            <main className="flex-1 pt-16 min-w-0">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
