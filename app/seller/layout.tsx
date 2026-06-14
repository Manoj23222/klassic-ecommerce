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
        <div className="hidden md:block">
          <SellerSidebar />
        </div>

        <section className="flex-1 p-3 md:p-6 overflow-x-hidden">
          {children}
        </section>
      </div>
    </main>
  );
}