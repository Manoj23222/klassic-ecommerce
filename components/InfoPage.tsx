import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function InfoPage({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-gray-100">
      <Header />

      <section className="max-w-5xl mx-auto px-4 py-8">
        <Link href="/" className="text-blue-600 text-sm font-semibold">
          ← Back to Home
        </Link>

        <div className="bg-white mt-4 p-5 md:p-8 rounded-2xl shadow">
          <h1 className="text-2xl md:text-3xl font-bold mb-5">{title}</h1>
          <div className="text-sm md:text-base text-gray-700 leading-7 space-y-4">
            {children}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}