import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#f4f6fb]">
      <AdminSidebar />

      <main className="h-screen flex-1 overflow-y-auto p-4 md:p-6">
        {children}
      </main>
    </div>
  );
}