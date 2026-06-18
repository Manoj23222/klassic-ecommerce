"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SellerLogoutPage() {
  const router = useRouter();

  useEffect(() => {
    localStorage.removeItem("seller");

    document.cookie =
      "seller_id=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

    document.cookie =
      "user_id=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

    router.replace("/seller/login");
  }, [router]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="rounded-3xl bg-white p-8 text-center shadow">
        <h1 className="text-2xl font-black">Logging out...</h1>
        <p className="mt-2 text-gray-500">
          Please wait
        </p>
      </div>
    </main>
  );
}