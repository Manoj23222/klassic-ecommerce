import CartItems from "@/components/CartItems";
export default function CartPage() {
  return (
    <main className="min-h-screen p-10 bg-gray-100">
      <h1 className="text-4xl font-bold mb-6">
        Shopping Cart
      </h1>

      <div className="bg-white p-6 rounded-xl shadow">
        <CartItems />
      </div>
    </main>
  );
}