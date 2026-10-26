import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { Suspense } from "react";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Riftbound Notes",
  description: "Log your Riftbound games and reflect on how they went.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <header className="border-b border-zinc-200 dark:border-zinc-800">
          <div className="mx-auto flex w-full max-w-2xl items-center justify-between gap-3 px-4 py-3 md:max-w-3xl">
            <Link
              href="/"
              className="inline-flex min-h-11 items-center rounded-lg text-lg font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            >
              Riftbound Notes
            </Link>
            <Link
              href="/games/new"
              className="inline-flex min-h-11 items-center rounded-lg bg-indigo-600 px-4 font-medium text-white hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-950"
            >
              New game
            </Link>
          </div>
        </header>
        <div className="mx-auto w-full max-w-2xl flex-1 px-4 py-6 md:max-w-3xl">{/* client pages read route params and the current date at request time, so stream them */}
          <Suspense fallback={<p className="text-zinc-600 dark:text-zinc-400">Loading…</p>}>{children}</Suspense>
        </div>
      </body>
    </html>
  );
}
