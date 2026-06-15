import SellerSidebar from "@/components/seller/SellerSidebar";
import SellerMobileHeader from "@/components/seller/SellerMobileHeader";

export default function SellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-gray-100">
      <SellerMobileHeader />

      <div className="md:flex">
  <SellerSidebar />

  <section className="flex-1 p-3 md:p-6 overflow-x-hidden lg:ml-[280px]">
    {children}
  </section>
</div>
    </main>
  );
}