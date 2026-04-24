import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NovaMind | Next-Gen AI Search",
  description: "A production-grade AI-powered search engine combining Google Search UX with Perplexity-style AI answers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} min-h-full flex flex-col bg-white text-zinc-900 antialiased selection:bg-blue-100 selection:text-blue-900 dark:bg-zinc-950 dark:text-zinc-100 dark:selection:bg-blue-900/50 dark:selection:text-white`}>
        {children}
      </body>
    </html>
  );
}
