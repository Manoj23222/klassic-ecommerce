"use client";

import { usePathname } from "next/navigation";
import SellerSidebar from "@/components/seller/SellerSidebar";

export default function SellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const authPages = [
    "/seller/login",
    "/seller/register",
    "/seller/register-success",
    "/seller/forgot-password",
    "/seller/reset-password",
  ];

  if (authPages.some((path) => pathname.startsWith(path))) {
    return <>{children}</>;
  }

  return (
    <main className="min-h-screen bg-gray-100 md:flex">
      <SellerSidebar />
      <section className="flex-1 p-4 md:p-6 overflow-x-hidden">
        {children}
      </section>
    </main>
  );
}