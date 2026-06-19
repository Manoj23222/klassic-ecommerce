import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Question from "@/models/Question";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

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

    question.answer = answer.trim();
    question.answered_by = "admin";
    question.status = "Answered";

    await question.save();

    return NextResponse.json({
      success: true,
      message: "Answer updated successfully",
    });
  } catch (error) {
    console.error("Admin update question error:", error);

    return NextResponse.json(
      { error: "Failed to update question" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;

    const question = await Question.findByIdAndDelete(id);

    if (!question) {
      return NextResponse.json(
        { error: "Question not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Question deleted successfully",
    });
  } catch (error) {
    console.error("Admin delete question error:", error);

    return NextResponse.json(
      { error: "Failed to delete question" },
      { status: 500 }
    );
  }
}