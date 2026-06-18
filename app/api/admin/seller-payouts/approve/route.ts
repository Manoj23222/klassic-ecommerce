import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Payout from "@/models/Payout";
import WalletTransaction from "@/models/WalletTransaction";
import Seller from "@/models/Seller";

export const dynamic = "force-dynamic";

function text(value: any) {
  if (value === undefined || value === null) return "";
  return String(value).trim();
}

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();

    const payoutId = text(body.payout_id);
    const transactionId = text(body.transaction_id);
    const markPaid = Boolean(body.mark_paid);

    if (!payoutId) {
      return NextResponse.json(
        { success: false, message: "payout_id required" },
        { status: 400 }
      );
    }

    const payout: any = await Payout.findById(payoutId);

    if (!payout) {
      return NextResponse.json(
        { success: false, message: "Payout not found" },
        { status: 404 }
      );
    }

    if (payout.status === "Paid") {
      return NextResponse.json(
        { success: false, message: "Payout already paid" },
        { status: 400 }
      );
    }

    const seller: any = await Seller.findById(payout.seller_id);

    const currentBalance = Number(seller?.wallet_balance || 0);
    const payoutAmount = Number(payout.payout_amount || 0);
    const newBalance = currentBalance + payoutAmount;

    payout.status = markPaid ? "Paid" : "Approved";
    payout.transaction_id = transactionId;
    payout.approved_at = payout.approved_at || new Date();

    if (markPaid) {
      payout.paid_at = new Date();
    }

    await payout.save();

    if (seller) {
      seller.wallet_balance = newBalance;
      await seller.save();
    }

    await WalletTransaction.create({
      seller_id: payout.seller_id,
      seller_store_name: payout.seller_store_name,
      payout_id: String(payout._id),
      order_id: payout.order_id,
      type: "Credit",
      amount: payoutAmount,
      balance_after: newBalance,
      status: markPaid ? "Completed" : "Pending",
      description: markPaid
        ? "Seller payout paid"
        : "Seller payout approved",
      reference_id: transactionId,
    });

    return NextResponse.json({
      success: true,
      message: markPaid ? "Payout paid" : "Payout approved",
      payout,
    });
  } catch (error: any) {
    console.error("Payout approve error:", error);

    return NextResponse.json(
      { success: false, message: error.message || "Server error" },
      { status: 500 }
    );
  }
}