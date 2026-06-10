import GroceryProductSection from "@/components/GroceryProductSection";
import Header from "@/components/Header";
import db from "@/lib/db";

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  image: string;
  category?: string;
};

async function getGroceryProducts(): Promise<Product[]> {
  const [products]: any = await db.query(
    `SELECT * FROM products 
     WHERE category IN (
      'Grocery',
      'Fruits & Vegetables',
      'Atta Rice & Dal',
      'Masala & Spices',
      'Papad & Pickles',
      'Oil & Ghee',
      'Snacks & Namkeen',
      'Biscuits & Cookies',
      'Tea & Coffee',
      'Milk & Dairy',
      'Bread & Bakery',
      'Cleaning & Household',
      'Personal Care',
      'Baby Care',
      'Pet Food',
      'Frozen Food'
     )
     ORDER BY id DESC`
  );

  return products;
}

export default async function GroceryPage() {
  const products = await getGroceryProducts();

  return (
    <main className="min-h-screen bg-green-50">
      <Header />

      <section className="relative overflow-hidden bg-gradient-to-r from-green-700 via-emerald-500 to-lime-400 text-white">
        <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <p className="bg-white/20 inline-block px-4 py-2 rounded-full font-bold mb-4">
              🛒 Klassic Grocery
            </p>

            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight">
              Fresh Grocery Delivered Fast
            </h1>

            <p className="mt-5 text-xl text-green-50">
              Daily essentials, fresh items, kitchen needs and smart deals in one place.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <span className="bg-white text-green-700 px-5 py-3 rounded-xl font-bold">
                🚚 Fast Delivery
              </span>
              <span className="bg-white text-green-700 px-5 py-3 rounded-xl font-bold">
                💵 COD Available
              </span>
              <span className="bg-white text-green-700 px-5 py-3 rounded-xl font-bold">
                🎁 Daily Deals
              </span>
            </div>
          </div>

          <div className="bg-white/20 rounded-3xl p-8 text-center backdrop-blur">
            <div className="text-8xl">🥦🍎🥛</div>
            <h2 className="text-3xl font-bold mt-4">Fresh Picks Today</h2>
            <p className="mt-2">Save more on grocery essentials</p>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white rounded-3xl shadow p-6">
          <div className="grid md:grid-cols-3 gap-5 text-center">
            <div className="bg-green-50 rounded-2xl p-5">
              <h3 className="text-2xl font-bold">⚡ Fast Delivery</h3>
              <p className="text-gray-600 mt-2">Fresh items at your doorstep</p>
            </div>

            <div className="bg-yellow-50 rounded-2xl p-5">
              <h3 className="text-2xl font-bold">🔥 Smart Deals</h3>
              <p className="text-gray-600 mt-2">Daily grocery savings</p>
            </div>

            <div className="bg-blue-50 rounded-2xl p-5">
              <h3 className="text-2xl font-bold">✅ Fresh Assured</h3>
              <p className="text-gray-600 mt-2">Quality checked products</p>
            </div>
          </div>
        </div>
      </section>

      <GroceryProductSection products={products} />
    </main>
  );
}