import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import connectDB from "@/lib/mongodb";
import Seller from "@/models/Seller";
import WithdrawRequest from "@/models/WithdrawRequest";
import WalletTransaction from "@/models/WalletTransaction";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
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

    const body = await req.json();
    const amount = Number(body.amount || 0);
    const method = body.method || "Bank Transfer";

    if (!amount || amount < 100) {
      return NextResponse.json(
        { success: false, message: "Minimum withdraw amount is ₹100" },
        { status: 400 }
      );
    }

    const seller: any = await Seller.findById(sellerId);

    if (!seller) {
      return NextResponse.json(
        { success: false, message: "Seller not found" },
        { status: 404 }
      );
    }

    if (seller.status !== "Approved") {
      return NextResponse.json(
        { success: false, message: "Only approved sellers can withdraw" },
        { status: 403 }
      );
    }

    const pendingRequests = await WithdrawRequest.find({
      seller_id: sellerId,
      status: "Pending",
    });

    const pendingAmount = pendingRequests.reduce(
      (sum, item: any) => sum + Number(item.amount || 0),
      0
    );

    const availableBalance = Number(seller.wallet_balance || 0) - pendingAmount;

    if (amount > availableBalance) {
      return NextResponse.json(
        { success: false, message: "Insufficient available wallet balance" },
        { status: 400 }
      );
    }

    const withdraw = await WithdrawRequest.create({
      seller_id: sellerId,
      seller_name: seller.name,
      seller_store_name: seller.store_name,
      amount,
      method,
      status: "Pending",
      bank_details: {
        account_holder: seller.account_holder,
        bank_name: seller.bank_name,
        account_number: seller.account_number,
        ifsc: seller.ifsc,
        upi_id: seller.upi_id,
      },
    });

    await WalletTransaction.create({
      seller_id: sellerId,
      type: "Withdraw Request",
      amount,
      status: "Pending",
      description: `Withdraw request created via ${method}`,
      reference_id: withdraw._id.toString(),
    });

    return NextResponse.json({
      success: true,
      message: "Withdraw request submitted successfully",
      withdraw,
    });
  } catch (error) {
    console.error("Seller withdraw error:", error);

    return NextResponse.json(
      { success: false, message: "Withdraw request failed" },
      { status: 500 }
    );
  }
}