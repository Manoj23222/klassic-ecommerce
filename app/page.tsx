import DailySpinWheel from "@/components/DailySpinWheel";
import MysteryDiscountBox from "@/components/MysteryDiscountBox";
export const dynamic = "force-dynamic";

import Header from "@/components/Header";
import ProductSearch from "@/components/ProductSearch";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";

type ProductType = {
  _id: string;
  id?: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  image: string;
  category?: string;
  featured?: boolean;
};

async function getProducts(): Promise<ProductType[]> {
  try {
    await connectDB();

    const products = await Product.find({ status: "Approved" })
      .sort({ createdAt: -1 })
      .lean();

    return products.map((product: any) => ({
      ...product,
      _id: product._id.toString(),
      id: product._id.toString(),
    }));
  } catch (error) {
    console.error("Products fetch error:", error);
    return [];
  }
}

export default async function Home() {
  const products = await getProducts();

  return (
    <main className="min-h-screen bg-gray-100">
      <Header />

      <section className="relative overflow-hidden bg-gradient-to-r from-indigo-700 via-blue-600 to-cyan-500 text-white py-3 lg:py-5">
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-white opacity-10 rounded-full"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-yellow-300 opacity-20 rounded-full blur-3xl"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-3 items-center">
          <div className="text-center lg:text-left order-2 lg:order-1">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold">
              Welcome to Klassic
            </h1>

            <p className="mt-2 text-sm md:text-base lg:text-xl">
              Smart Shopping • Best Deals • Fast Delivery
            </p>

            <a
              href="#products"
              className="inline-block mt-3 bg-yellow-400 text-black px-6 py-2 lg:px-8 lg:py-3 rounded-xl font-bold hover:bg-yellow-300 shadow-lg"
            >
              Shop Now
            </a>
          </div>

          <div className="order-1 lg:order-2 max-w-md mx-auto lg:ml-auto w-full space-y-2 scale-95 lg:scale-90 origin-top">
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-1 shadow-xl">
              <MysteryDiscountBox />
            </div>

            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-1 shadow-xl">
              <DailySpinWheel />
            </div>
          </div>
        </div>
      </section>

      <section id="products" className="max-w-7xl mx-auto px-6 py-6">
        <ProductSearch products={products} />
      </section>
    </main>
  );
}