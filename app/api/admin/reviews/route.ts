import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import Review from "@/models/Review";
import Product from "@/models/Product";
import User from "@/models/User";
import { requireAdmin } from "@/lib/requireAdmin";

export async function GET() {
  try {
    await connectDB();
    await requireAdmin();

    const reviews = await Review.find({})
      .sort({ createdAt: -1 })
      .lean();

    const formattedReviews = await Promise.all(
      reviews.map(async (review: any) => {
        const [user, product] = await Promise.all([
          review.user_id &&
          mongoose.Types.ObjectId.isValid(review.user_id)
            ? User.findById(review.user_id).lean()
            : null,

          review.product_id &&
          mongoose.Types.ObjectId.isValid(review.product_id)
            ? Product.findById(review.product_id).lean()
            : null,
        ]);

        return {
          id: String(review._id),
          rating: review.rating,
          comment: review.comment,
          created_at: review.createdAt,
          user_name: user?.name || review.customer_name || "Unknown",
          user_email: user?.email || "",
          product_name: product?.name || "Deleted Product",
        };
      })
    );

    return NextResponse.json({
      success: true,
      reviews: formattedReviews,
    });
  } catch (error) {
    console.error("ADMIN REVIEWS ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Reviews fetch failed",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    await connectDB();
    await requireAdmin();

    const { id } = await req.json();

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid review ID",
        },
        { status: 400 }
      );
    }

    const review = await Review.findByIdAndDelete(id);

    if (!review) {
      return NextResponse.json(
        {
          success: false,
          message: "Review not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Review deleted",
    });
  } catch (error) {
    console.error("DELETE REVIEW ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Review delete failed",
      },
      { status: 500 }
    );
  }
}