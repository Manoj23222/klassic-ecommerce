import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { requireAdmin } from "@/lib/requireAdmin";

export const dynamic = "force-dynamic";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    await requireAdmin();

    const { id } = await params;
    const body = await req.json();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid customer ID" },
        { status: 400 }
      );
    }

    if (!["Active", "Blocked"].includes(body.status)) {
      return NextResponse.json(
        { success: false, message: "Invalid status" },
        { status: 400 }
      );
    }

    const customer = await User.findByIdAndUpdate(
      id,
      { status: body.status },
      { new: true }
    ).select("-password");

    if (!customer) {
      return NextResponse.json(
        { success: false, message: "Customer not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message:
        body.status === "Blocked"
          ? "Customer blocked successfully"
          : "Customer activated successfully",
      customer,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Customer update failed" },
      { status: 500 }
    );
  }
}