import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import ProductPageClient from "@/components/ProductPageClient";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ id: string }>;
};

async function getProduct(id: string) {
  await connectDB();

  if (!mongoose.Types.ObjectId.isValid(id)) return null;

  const product = await Product.findOne({
    _id: id,
    status: "Approved",
  }).lean();

  if (!product) return null;

  return JSON.parse(JSON.stringify(product));
}

async function getRelatedProducts(category: string, productId: string) {
  await connectDB();

  const products = await Product.find({
    category,
    status: "Approved",
    _id: { $ne: new mongoose.Types.ObjectId(productId) },
  })
    .limit(12)
    .select("name price sale_price image category brand rating")
    .lean();

  return JSON.parse(JSON.stringify(products));
}

export default async function ProductPage({ params }: PageProps) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    return (
      <main className="min-h-screen bg-gray-100 p-10 text-center">
        <h1 className="text-3xl font-bold">Product Not Found</h1>
      </main>
    );
  }

  const relatedProducts = await getRelatedProducts(
    product.category || "General",
    String(product._id)
  );

  return (
    <ProductPageClient
      product={product}
      relatedProducts={relatedProducts}
    />
  );
}