import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import connectDB from "@/lib/mongodb";
import Question from "@/models/Question";

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

    const questions = await Question.find({ product_id: productId })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(questions);
  } catch (error) {
    console.error("Get questions error:", error);

    return NextResponse.json(
      { error: "Failed to load questions" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();

    const cookieStore = await cookies();
    const userId = cookieStore.get("user_id")?.value || "";

    const { productId, name, question } = await req.json();

    if (!productId || !name || !question) {
      return NextResponse.json(
        { error: "All fields required" },
        { status: 400 }
      );
    }

    await Question.create({
      product_id: productId,
      user_id: userId,
      customer_name: name,
      question,
      status: "Pending",
    });

    return NextResponse.json({
      success: true,
      message: "Question submitted successfully",
    });
  } catch (error) {
    console.error("Create question error:", error);

    return NextResponse.json(
      { error: "Failed to submit question" },
      { status: 500 }
    );
  }
}