import FrequentlyBoughtTogether from "@/components/FrequentlyBoughtTogether";
import ProductPurchaseBox from "@/components/ProductPurchaseBox";
import ProductGallery from "@/components/ProductGallery";
import RecentlyViewed from "@/components/RecentlyViewed";
import WishlistButton from "@/components/WishlistButton";
import ReviewForm from "@/components/ReviewForm";
import Header from "@/components/Header";
import Link from "next/link";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";

type ProductType = {
  _id: string;
  id?: string;
  name: string;
  description?: string;
  price: number;
  stock?: number;
  image?: string;
  category?: string;
  gallery_images?: string[];
  colors?: string;
  sizes?: string;
};

async function getProduct(id: string): Promise<ProductType | null> {
  try {
    await connectDB();

    if (!mongoose.Types.ObjectId.isValid(id)) return null;

    const product: any = await Product.findOne({
      _id: id,
      status: "Approved",
    }).lean();

    if (!product) return null;

    const productId = product._id.toString();

    return {
      ...product,
      _id: productId,
      id: productId,
      price: Number(product.price || 0),
      stock: Number(product.stock || 0),
      image: product.image || "",
      description: product.description || "",
    };
  } catch (error) {
    console.error("Product fetch error:", error);
    return null;
  }
}

async function getRelatedProducts(category?: string, productId?: string) {
  try {
    await connectDB();

    const query: any = {
      category: category || "General",
      status: "Approved",
    };

    if (productId && mongoose.Types.ObjectId.isValid(productId)) {
      query._id = { $ne: new mongoose.Types.ObjectId(productId) };
    }

    const products = await Product.find(query)
      .limit(4)
      .select("name price image category")
      .lean();

    return products.map((item: any) => ({
      ...item,
      _id: item._id.toString(),
      id: item._id.toString(),
      price: Number(item.price || 0),
      image: item.image || "",
    }));
  } catch (error) {
    console.error("Related products error:", error);
    return [];
  }
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) return <h1 className="p-10 text-3xl">Product not found</h1>;

  const productId = product.id || product._id;

  const reviews: any[] = [];
  const relatedProducts = await getRelatedProducts(product.category, productId);

  const offerPrice = Number(product.price || 0);
  const mrp = Math.round(offerPrice * 1.25);
  const discount = mrp > 0 ? Math.round(((mrp - offerPrice) / mrp) * 100) : 0;

  const avgRating = "0.0";

  return (
    <main className="min-h-screen bg-gray-100">
      <Header />

      <div className="max-w-7xl mx-auto px-3 md:px-6 py-4 md:py-6">
        <Link href="/" className="text-blue-600 font-semibold text-sm">
          Home / {product.category || "General"} / {product.name}
        </Link>

        <div className="mt-4 bg-white rounded-2xl shadow grid lg:grid-cols-2 gap-5 md:gap-8 p-3 md:p-6">
          <div>
            <ProductGallery
              mainImage={product.image || ""}
              galleryImages={product.gallery_images || []}
            />

            {(product.stock || 0) > 0 ? (
              <ProductPurchaseBox
                product={{
                  id: productId,
                  name: product.name,
                  price: offerPrice,
                  image: product.image || "",
                  colors: product.colors,
                  sizes: product.sizes,
                }}
              />
            ) : (
              <button
                disabled
                className="mt-4 w-full bg-gray-400 text-white py-3 rounded-xl font-bold"
              >
                Out of Stock
              </button>
            )}

            <div className="mt-4">
              <WishlistButton
                product={{
                  id: productId,
                  name: product.name,
                  price: offerPrice,
                  image: product.image || "",
                }}
              />
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              {product.category || "General"}
            </p>

            <h1 className="text-2xl md:text-3xl font-bold mt-2">
              {product.name}
            </h1>

            <div className="flex flex-wrap items-center gap-2 mt-3">
              <span className="bg-green-600 text-white px-2 py-1 rounded text-sm font-bold">
                {avgRating} ★
              </span>

              <span className="text-gray-500 text-sm">
                {reviews.length} ratings and reviews
              </span>
            </div>

            <div className="text-yellow-500 text-base md:text-lg mt-1">
              No ratings yet
            </div>

            <div className="mt-4 flex flex-wrap items-end gap-2">
              <p className="text-3xl md:text-4xl text-green-700 font-bold">
                ₹{offerPrice.toFixed(2)}
              </p>

              <p className="line-through text-gray-400 text-base md:text-lg">
                ₹{mrp.toFixed(2)}
              </p>

              <p className="text-green-600 font-bold">{discount}% off</p>
            </div>

            <p
              className={
                (product.stock || 0) > 0
                  ? "mt-3 text-green-600 font-bold"
                  : "mt-3 text-red-600 font-bold"
              }
            >
              {(product.stock || 0) > 0
                ? `In Stock: ${product.stock}`
                : "Out of Stock"}
            </p>

            <div className="mt-5 border rounded-2xl p-4">
              <h3 className="font-bold mb-3">Delivery details</h3>

              <div className="bg-blue-50 p-3 rounded-xl text-sm">
                🚚 Delivery by 3-5 working days
              </div>

              <div className="grid grid-cols-3 gap-2 mt-3 text-center text-xs md:text-sm">
                <div className="bg-gray-100 p-2 md:p-3 rounded-xl">
                  🔁
                  <br />7 Days Return
                </div>

                <div className="bg-gray-100 p-2 md:p-3 rounded-xl">
                  💵
                  <br />
                  COD
                </div>

                <div className="bg-gray-100 p-2 md:p-3 rounded-xl">
                  ✅
                  <br />
                  Assured
                </div>
              </div>
            </div>

            <div className="mt-5 border rounded-2xl p-4">
              <h3 className="font-bold mb-3">Product highlights</h3>

              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="bg-gray-50 p-3 rounded-xl">
                  Category
                  <br />
                  <b>{product.category || "General"}</b>
                </div>

                <div className="bg-gray-50 p-3 rounded-xl">
                  Payment
                  <br />
                  <b>COD Available</b>
                </div>

                <div className="bg-gray-50 p-3 rounded-xl">
                  Offer
                  <br />
                  <b>{discount}% Off</b>
                </div>

                <div className="bg-gray-50 p-3 rounded-xl">
                  Stock
                  <br />
                  <b>{product.stock || 0}</b>
                </div>
              </div>
            </div>

            <div className="mt-5 border rounded-2xl p-4">
              <h3 className="font-bold mb-2">All details</h3>
              <p className="text-gray-600 leading-7 text-sm md:text-base">
                {product.description || "No description available"}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-white rounded-2xl shadow p-4 md:p-6">
          <h2 className="text-xl md:text-2xl font-bold mb-4">
            Customer Reviews
          </h2>

          <p className="text-gray-500">No reviews yet.</p>
        </div>

        <ReviewForm productId={productId} />

        <RecentlyViewed
          product={{
            id: productId,
            name: product.name,
            price: offerPrice,
            image: product.image || "",
          }}
        />

        <FrequentlyBoughtTogether
          mainProduct={{
            id: productId,
            name: product.name,
            price: offerPrice,
            image: product.image || "",
          }}
          products={relatedProducts.map((item: any) => ({
            id: item.id || item._id,
            name: item.name,
            price: Number(item.price || 0),
            image: item.image || "",
          }))}
        />

        <div className="mt-6 bg-white rounded-2xl shadow p-4 md:p-6">
          <h2 className="text-xl md:text-2xl font-bold mb-4">
            Related Products
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
            {relatedProducts.map((item: any) => {
              const relatedId = item.id || item._id;

              return (
                <Link
                  key={relatedId}
                  href={`/product/${relatedId}`}
                  className="border rounded-xl p-3 md:p-4 hover:shadow"
                >
                  <img
                    src={item.image || "/placeholder.png"}
                    alt={item.name}
                    className="h-28 md:h-40 w-full object-contain"
                  />

                  <h3 className="font-bold mt-3 text-sm md:text-base line-clamp-2">
                    {item.name}
                  </h3>

                  <p className="text-green-700 font-bold">₹{item.price}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
}