import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-gray-100">
      <div className="flex min-h-screen w-full overflow-x-hidden">
        <div className="hidden lg:block shrink-0">
          <AdminSidebar />
        </div>

        <section className="min-w-0 flex-1 w-full p-3 sm:p-4 lg:p-8">
          {children}
        </section>
      </div>
    </main>
  );
}