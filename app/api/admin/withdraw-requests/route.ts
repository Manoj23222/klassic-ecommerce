import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Seller from "@/models/Seller";
import WithdrawRequest from "@/models/WithdrawRequest";
import WalletTransaction from "@/models/WalletTransaction";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    await connectDB();

    const { withdrawId, status } = await req.json();

    if (!withdrawId || !["Approved", "Rejected"].includes(status)) {
      return NextResponse.json(
        { success: false, message: "Invalid request" },
        { status: 400 }
      );
    }

    const withdraw: any = await WithdrawRequest.findById(withdrawId);

    if (!withdraw) {
      return NextResponse.json(
        { success: false, message: "Withdraw request not found" },
        { status: 404 }
      );
    }

    if (withdraw.status !== "Pending") {
      return NextResponse.json(
        { success: false, message: "Request already processed" },
        { status: 400 }
      );
    }

    const seller: any = await Seller.findById(withdraw.seller_id);

    if (!seller) {
      return NextResponse.json(
        { success: false, message: "Seller not found" },
        { status: 404 }
      );
    }

    const amount = Number(withdraw.amount || 0);

    if (status === "Approved") {
      if (Number(seller.wallet_balance || 0) < amount) {
        return NextResponse.json(
          { success: false, message: "Seller wallet balance is low" },
          { status: 400 }
        );
      }

      seller.wallet_balance = Number(seller.wallet_balance || 0) - amount;
      await seller.save();
    }

    withdraw.status = status;
    withdraw.processed_at = new Date();
    await withdraw.save();

    await WalletTransaction.create({
      seller_id: seller._id,
      type: status === "Approved" ? "Withdraw Approved" : "Withdraw Rejected",
      amount,
      status,
      description:
        status === "Approved"
          ? "Withdraw request approved by admin"
          : "Withdraw request rejected by admin",
      reference_id: withdraw._id.toString(),
    });

    return NextResponse.json({
      success: true,
      message: `Withdraw request ${status.toLowerCase()} successfully`,
      withdraw,
    });
  } catch (error) {
    console.error("Admin withdraw request error:", error);

    return NextResponse.json(
      { success: false, message: "Withdraw request update failed" },
      { status: 500 }
    );
  }
}