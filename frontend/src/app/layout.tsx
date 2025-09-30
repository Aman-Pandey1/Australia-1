import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "Directory Listings",
  description: "Premium, Popular, and Newest listings",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <header className="border-b">
          <nav className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-4 text-sm">
            <a href="/" className="font-medium">Home</a>
            <a href="/listings/new" className="text-gray-700">Add Listing</a>
            <a href="/auth" className="ml-auto text-gray-700">Auth</a>
            <a href="/dashboard" className="text-gray-700">Dashboard</a>
          </nav>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
