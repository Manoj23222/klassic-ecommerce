import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import connectDB from "@/lib/mongodb";
import Question from "@/models/Question";
import Product from "@/models/Product";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const cookieStore = await cookies();
    const sellerId = cookieStore.get("seller_id")?.value || "";

    if (!sellerId) {
      return NextResponse.json(
        { error: "Seller login required" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const { answer } = await req.json();

    if (!answer || !answer.trim()) {
      return NextResponse.json(
        { error: "Answer required" },
        { status: 400 }
      );
    }

    const question = await Question.findById(id);

    if (!question) {
      return NextResponse.json(
        { error: "Question not found" },
        { status: 404 }
      );
    }

    const product = await Product.findById(question.product_id).lean();

    if (!product || String(product.seller_id) !== String(sellerId)) {
      return NextResponse.json(
        { error: "Not allowed" },
        { status: 403 }
      );
    }

    question.answer = answer.trim();
    question.answered_by = sellerId;
    question.status = "Answered";

    await question.save();

    return NextResponse.json({
      success: true,
      message: "Answer submitted successfully",
    });
  } catch (error) {
    console.error("Seller answer question error:", error);

    return NextResponse.json(
      { error: "Failed to answer question" },
      { status: 500 }
    );
  }
}