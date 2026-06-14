import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-gray-100">
      <div className="md:flex">
        <div className="hidden md:block">
          <AdminSidebar />
        </div>

        <section className="flex-1 p-3 md:p-8 overflow-x-hidden">
          {children}
        </section>
      </div>
    </main>
  );
}