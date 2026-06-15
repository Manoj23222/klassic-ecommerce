import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Seller from "@/models/Seller";
import Payout from "@/models/Payout";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectDB();

    const payouts = await Payout.find().sort({ createdAt: -1 }).lean();

    const sellers = await Seller.find({ status: "Approved" })
      .select(
        "store_name name email phone bank_name bank_account_holder bank_account_number bank_ifsc upi_id wallet_balance pending_payout total_sales"
      )
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      payouts,
      sellers: sellers.map((s: any) => ({
        id: String(s._id),
        store_name: s.store_name || "",
        name: s.name || "",
        email: s.email || "",
        phone: s.phone || "",
        bank_name: s.bank_name || "",
        bank_account_holder: s.bank_account_holder || "",
        bank_account_number: s.bank_account_number || "",
        bank_ifsc: s.bank_ifsc || "",
        upi_id: s.upi_id || "",
        wallet_balance: Number(s.wallet_balance || 0),
        pending_payout: Number(s.pending_payout || 0),
        total_sales: Number(s.total_sales || 0),
      })),
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Payout fetch failed" },
      { status: 500 }
    );
  }
}