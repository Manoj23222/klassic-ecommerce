import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import connectDB from "@/lib/mongodb";
import Review from "@/models/Review";

export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID required" },
        { status: 400 }
      );
    }

    const reviews = await Review.find({ product_id: productId })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(reviews);
  } catch (error) {
    console.error("Get reviews error:", error);

    return NextResponse.json(
      { error: "Failed to load reviews" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();

    const cookieStore = await cookies();
    const userId = cookieStore.get("user_id")?.value || "";

    const { productId, orderId, name, rating, comment } = await req.json();

    const cleanRating = Number(rating);

    if (!productId || !name || !cleanRating || !comment) {
      return NextResponse.json(
        { error: "All fields required" },
        { status: 400 }
      );
    }

    if (cleanRating < 1 || cleanRating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    if (orderId && userId) {
      const oldReview = await Review.findOne({
        product_id: productId,
        order_id: orderId,
        user_id: userId,
      }).lean();

      if (oldReview) {
        return NextResponse.json(
          { error: "You already reviewed this product" },
          { status: 400 }
        );
      }
    }

    await Review.create({
      product_id: productId,
      user_id: userId,
      order_id: orderId || "",
      customer_name: name,
      rating: cleanRating,
      comment,
      status: "Approved",
    });

    return NextResponse.json({
      success: true,
      message: "Review submitted successfully",
    });
  } catch (error) {
    console.error("Create review error:", error);

    return NextResponse.json(
      { error: "Failed to submit review" },
      { status: 500 }
    );
  }
}