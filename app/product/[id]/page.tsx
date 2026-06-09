import ProductPurchaseBox from "@/components/ProductPurchaseBox";
import ProductGallery from "@/components/ProductGallery";
import RecentlyViewed from "@/components/RecentlyViewed";
import WishlistButton from "@/components/WishlistButton";
import ReviewForm from "@/components/ReviewForm";
import Header from "@/components/Header";
import Link from "next/link";
import db from "@/lib/db";

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  image: string;
  category?: string;
  gallery_images?: string;
  colors?: string;
  sizes?: string;
};

async function getProduct(id: string): Promise<Product | null> {
  try {
    const [rows]: any = await db.query(
      "SELECT * FROM products WHERE id = ?",
      [id]
    );

    if (rows.length === 0) return null;
    return rows[0];
  } catch (error) {
    console.error("Product detail error:", error);
    return null;
  }
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    return <h1 className="p-10 text-3xl">Product not found</h1>;
  }

  const [reviews]: any = await db.query(
"SELECT * FROM reviews WHERE product_id = ? ORDER BY id DESC",    [id]
  );

  const [relatedProducts]: any = await db.query(
    "SELECT * FROM products WHERE category = ? AND id != ? LIMIT 4",
    [product.category, id]
  );

  const offerPrice = Number(product.price);
  const mrp = Math.round(offerPrice * 1.25);
  const discount = Math.round(((mrp - offerPrice) / mrp) * 100);

  const avgRating =
    reviews.length > 0
      ? (
          reviews.reduce(
            (sum: number, review: any) => sum + Number(review.rating),
            0
          ) / reviews.length
        ).toFixed(1)
      : "0.0";

  const rating5 = reviews.filter((r: any) => Number(r.rating) === 5).length;
  const rating4 = reviews.filter((r: any) => Number(r.rating) === 4).length;
  const rating3 = reviews.filter((r: any) => Number(r.rating) === 3).length;
  const rating2 = reviews.filter((r: any) => Number(r.rating) === 2).length;
  const rating1 = reviews.filter((r: any) => Number(r.rating) === 1).length;

  return (
    <main className="min-h-screen bg-gray-100">
      <Header />

      <div className="max-w-7xl mx-auto px-6 py-6">
        <Link href="/" className="text-blue-600 font-semibold">
          Home / {product.category || "General"} / {product.name}
        </Link>

        <div className="mt-5 bg-white rounded-xl shadow grid lg:grid-cols-2 gap-8 p-6">
          <div>
            <ProductGallery
              mainImage={product.image}
              galleryImages={
                product.gallery_images ? product.gallery_images.split(",") : []
              }
            />

            {product.stock > 0 ? (
              <ProductPurchaseBox
                product={{
                  id: product.id,
                  name: product.name,
                  price: Number(product.price),
                  image: product.image,
                  colors: product.colors,
                  sizes: product.sizes,
                }}
              />
            ) : (
              <button
                disabled
                className="mt-5 w-full bg-gray-400 text-white py-3 rounded-lg font-bold"
              >
                Out of Stock
              </button>
            )}

            <div className="mt-4">
              <WishlistButton
                product={{
                  id: product.id,
                  name: product.name,
                  price: Number(product.price),
                  image: product.image,
                }}
              />
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              {product.category || "General"}
            </p>

            <h1 className="text-3xl font-bold mt-2">{product.name}</h1>

            <div className="flex items-center gap-3 mt-3">
              <span className="bg-green-600 text-white px-2 py-1 rounded text-sm font-bold">
                {avgRating} ★
              </span>

              <span className="text-gray-500 text-sm">
                {reviews.length} ratings and reviews
              </span>
            </div>

            <span className="text-yellow-500 text-lg">
              {reviews.length > 0
                ? "⭐".repeat(Math.round(Number(avgRating)))
                : "No ratings yet"}
            </span>

            <div className="mt-5 flex items-end gap-3">
              <p className="text-4xl text-green-700 font-bold">
                ₹{offerPrice.toFixed(2)}
              </p>

              <p className="line-through text-gray-400 text-lg">
                ₹{mrp.toFixed(2)}
              </p>

              <p className="text-green-600 font-bold">{discount}% off</p>
            </div>

            <p
              className={
                product.stock > 0
                  ? "mt-3 text-green-600 font-bold"
                  : "mt-3 text-red-600 font-bold"
              }
            >
              {product.stock > 0
                ? `In Stock: ${product.stock}`
                : "Out of Stock"}
            </p>

            <div className="mt-5 border rounded-xl p-4">
              <h3 className="font-bold mb-3">Delivery details</h3>

              <div className="bg-blue-50 p-3 rounded-lg text-sm">
                🚚 Delivery by 3-5 working days
              </div>

              <div className="grid grid-cols-3 gap-3 mt-4 text-center text-sm">
                <div className="bg-gray-100 p-3 rounded-lg">
                  🔁
                  <br />7 Days Return
                </div>

                <div className="bg-gray-100 p-3 rounded-lg">
                  💵
                  <br />
                  Cash on Delivery
                </div>

                <div className="bg-gray-100 p-3 rounded-lg">
                  ✅
                  <br />
                  Klassic Assured
                </div>
              </div>
            </div>

            <div className="mt-5 border rounded-xl p-4">
              <h3 className="font-bold mb-3">Product highlights</h3>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-gray-50 p-3 rounded">
                  Category
                  <br />
                  <b>{product.category || "General"}</b>
                </div>

                <div className="bg-gray-50 p-3 rounded">
                  Payment
                  <br />
                  <b>COD Available</b>
                </div>

                <div className="bg-gray-50 p-3 rounded">
                  Offer
                  <br />
                  <b>{discount}% Off</b>
                </div>

                <div className="bg-gray-50 p-3 rounded">
                  Stock
                  <br />
                  <b>{product.stock}</b>
                </div>
              </div>
            </div>

            <div className="mt-5 border rounded-xl p-4">
              <h3 className="font-bold mb-2">All details</h3>
              <p className="text-gray-600 leading-7">{product.description}</p>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-2xl shadow p-6">
          <h2 className="text-2xl font-bold mb-4">Customer Reviews</h2>

          <div className="mb-6 space-y-2">
            <p>⭐⭐⭐⭐⭐ {rating5}</p>
            <p>⭐⭐⭐⭐ {rating4}</p>
            <p>⭐⭐⭐ {rating3}</p>
            <p>⭐⭐ {rating2}</p>
            <p>⭐ {rating1}</p>
          </div>

          {reviews.length === 0 ? (
            <p className="text-gray-500">No reviews yet.</p>
          ) : (
            <div className="space-y-4">
              {reviews.map((review: any) => (
                <div key={review.id} className="border-b pb-4">
                  <p className="font-bold">{review.customer_name}</p>

                  <p className="text-yellow-500">
                    {"⭐".repeat(Number(review.rating))}
                  </p>

                  <p className="text-gray-600 mt-1">{review.comment}</p>

                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(review.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        <ReviewForm productId={product.id} />

        <RecentlyViewed
          product={{
            id: product.id,
            name: product.name,
            price: Number(product.price),
            image: product.image,
          }}
        />

        <div className="mt-8 bg-white rounded-2xl shadow p-6">
          <h2 className="text-2xl font-bold mb-4">Related Products</h2>

          <div className="grid md:grid-cols-4 gap-6">
            {relatedProducts.map((item: any) => (
              <Link
                key={item.id}
                href={`/product/${item.id}`}
                className="border rounded-xl p-4 hover:shadow"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-40 w-full object-contain"
                />

                <h3 className="font-bold mt-3">{item.name}</h3>
                <p className="text-green-700 font-bold">₹{item.price}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}