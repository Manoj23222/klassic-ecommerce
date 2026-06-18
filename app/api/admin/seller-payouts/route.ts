import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Payout from "@/models/Payout";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);

    const status = searchParams.get("status");
    const sellerId = searchParams.get("seller_id");

    const query: any = {};

    if (status) {
      query.status = status;
    }

    if (sellerId) {
      query.seller_id = sellerId;
    }

    const payouts = await Payout.find(query)
      .sort({ createdAt: -1 })
      .lean();

    const totalPending = payouts
      .filter((p: any) => p.status === "Pending")
      .reduce(
        (sum: number, p: any) =>
          sum + Number(p.payout_amount || 0),
        0
      );

    const totalPaid = payouts
      .filter((p: any) => p.status === "Paid")
      .reduce(
        (sum: number, p: any) =>
          sum + Number(p.payout_amount || 0),
        0
      );

    return NextResponse.json({
      success: true,
      payouts,
      summary: {
        totalPayouts: payouts.length,
        totalPending,
        totalPaid,
      },
    });
  } catch (error: any) {
    console.error("Payout fetch error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Payout fetch failed",
      },
      {
        status: 500,
      }
    );
  }
}