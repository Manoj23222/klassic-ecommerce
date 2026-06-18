import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import connectDB from "@/lib/mongodb";
import Seller from "@/models/Seller";
import Payout from "@/models/Payout";
import WalletTransaction from "@/models/WalletTransaction";
import WithdrawRequest from "@/models/WithdrawRequest";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectDB();

    const cookieStore = await cookies();

    const sellerId =
      cookieStore.get("seller_id")?.value ||
      cookieStore.get("user_id")?.value;

    if (!sellerId) {
      return NextResponse.json(
        { success: false, message: "Please login first" },
        { status: 401 }
      );
    }

    const seller = await Seller.findById(sellerId).lean();

    if (!seller) {
      return NextResponse.json(
        { success: false, message: "Seller not found" },
        { status: 404 }
      );
    }

    const transactions = await WalletTransaction.find({ seller_id: sellerId })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    const withdrawRequests = await WithdrawRequest.find({ seller_id: sellerId })
      .sort({ createdAt: -1 })
      .lean();

    const payouts = await Payout.find({ seller_id: sellerId })
      .sort({ createdAt: -1 })
      .lean();

    const pendingWithdrawAmount = withdrawRequests
      .filter((item: any) => item.status === "Pending")
      .reduce((sum: number, item: any) => sum + Number(item.amount || 0), 0);

    return NextResponse.json({
      success: true,
      wallet: {
        wallet_balance: Number((seller as any).wallet_balance || 0),
        pending_payout: Number((seller as any).pending_payout || 0),
        pending_withdraw_amount: pendingWithdrawAmount,
        available_balance:
          Number((seller as any).wallet_balance || 0) - pendingWithdrawAmount,
      },
      transactions,
      withdrawRequests,
      payouts,
    });
  } catch (error) {
    console.error("Seller wallet error:", error);

    return NextResponse.json(
      { success: false, message: "Wallet fetch failed" },
      { status: 500 }
    );
  }
}