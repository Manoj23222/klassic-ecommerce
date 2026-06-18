import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Review from "@/models/Review";
import Product from "@/models/Product";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const sellerId = searchParams.get("seller_id");

    if (!sellerId) {
      return NextResponse.json(
        { success: false, message: "seller_id required" },
        { status: 400 }
      );
    }

    const products = await Product.find({ seller_id: sellerId })
      .select("_id name")
      .lean();

    const productIds = products.map((p: any) => String(p._id));

    const productMap = new Map(
      products.map((p: any) => [String(p._id), p.name])
    );

    const reviews = await Review.find({
      product_id: { $in: productIds },
    })
      .sort({ createdAt: -1 })
      .lean();

    const finalReviews = reviews.map((review: any) => ({
      _id: String(review._id),
      product_id: review.product_id,
      product_name:
        review.product_name ||
        productMap.get(String(review.product_id)) ||
        "Product",
      customer_name: review.customer_name || review.user_name || "Customer",
      rating: review.rating || 5,
      comment: review.comment || review.review || "",
      createdAt: review.createdAt,
    }));

    return NextResponse.json({
      success: true,
      reviews: finalReviews,
    });
  } catch (error: any) {
    console.error("Seller reviews error:", error);

    return NextResponse.json(
      { success: false, message: error.message || "Server error" },
      { status: 500 }
    );
  }
}