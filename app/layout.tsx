
import AIShoppingAssistant from "@/components/AIShoppingAssistant";import FloatingCartButton from "@/components/FloatingCartButton";
import MobileBottomNav from "@/components/MobileBottomNav";
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
  title: "Klassic Ecommerce",
  description: "Smart Shopping • Best Deals • Fast Delivery",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-screen flex flex-col">
        <main className="flex-1">
          {children}
          <AIShoppingAssistant />
        </main>

       
        <MobileBottomNav />
        <FloatingCartButton />
      </body>
    </html>
  );
}