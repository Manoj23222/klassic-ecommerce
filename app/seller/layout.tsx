import SellerSidebar from "@/components/seller/SellerSidebar";

export default function SellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-gray-100">
      <div className="flex">
        <SellerSidebar />

        <section className="min-h-screen flex-1 lg:ml-72">
          {children}
        </section>
      </div>
    </main>
  );
}