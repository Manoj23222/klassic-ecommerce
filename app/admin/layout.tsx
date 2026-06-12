import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      <aside className="w-64 bg-slate-900 text-white p-5">
        <h1 className="text-2xl font-bold mb-8">Klassic Admin</h1>

        <ul className="space-y-4">
          <li><Link href="/admin">Dashboard</Link></li>
          <li><Link href="/admin/product">Products</Link></li>
          <li><Link href="/admin/products/pending">Product Approvals</Link></li>
          <li><Link href="/admin/orders">Orders</Link></li>
          <li><Link href="/admin/customers">Customers</Link></li>
          <li><Link href="/admin/reports">Reports</Link></li>
          <li><Link href="/admin/reviews">Reviews</Link></li>
        </ul>
      </aside>

      <main className="flex-1 p-8 bg-gray-100">{children}</main>
    </div>
  );
}