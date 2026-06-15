import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import Seller from "@/models/Seller";
import Payout from "@/models/Payout";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;
    const body = await req.json();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid payout ID" },
        { status: 400 }
      );
    }

    const payout = await Payout.findByIdAndUpdate(
      id,
      {
        status: body.status || "Paid",
        transaction_id: body.transaction_id || "",
        note: body.note || "",
        paid_at: body.status === "Paid" ? new Date() : null,
      },
      { new: true }
    );

    if (!payout) {
      return NextResponse.json(
        { success: false, message: "Payout not found" },
        { status: 404 }
      );
    }

    if (body.status === "Paid") {
      await Seller.findByIdAndUpdate(payout.seller_id, {
        $inc: {
          wallet_balance: -Number(payout.net_amount || 0),
          pending_payout: -Number(payout.net_amount || 0),
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: "Payout updated successfully",
      payout,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Payout update failed" },
      { status: 500 }
    );
  }
}