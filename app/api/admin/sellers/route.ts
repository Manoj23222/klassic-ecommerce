import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Seller from "@/models/Seller";
import Product from "@/models/Product";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectDB();

    const sellers = await Seller.find()
      .select("-password -reset_token")
      .sort({ createdAt: -1 })
      .lean();

    const productStats = await Product.aggregate([
      {
        $group: {
          _id: "$seller_id",
          totalProducts: { $sum: 1 },
          approvedProducts: {
            $sum: {
              $cond: [{ $eq: ["$status", "Approved"] }, 1, 0],
            },
          },
        },
      },
    ]);

    const statsMap = new Map(
      productStats.map((item: any) => [
        String(item._id || ""),
        {
          totalProducts: Number(item.totalProducts || 0),
          approvedProducts: Number(item.approvedProducts || 0),
        },
      ])
    );

    const formattedSellers = sellers.map((seller: any) => {
      const sellerId = String(seller._id);
      const stats = statsMap.get(sellerId) || {
        totalProducts: Number(seller.total_products || 0),
        approvedProducts: 0,
      };

      return {
        id: sellerId,
        name: seller.name || "",
        email: seller.email || "",
        phone: seller.phone || "",
        store_name: seller.store_name || "",
        business_type: seller.business_type || "",
        category: seller.category || "",
        pan: seller.pan || seller.pan_number || "",
        gst: seller.gst || seller.gst_number || "",
        address: seller.address || seller.business_address || "",
        status: seller.status || "Pending",
        verification_status: seller.verification_status || "Pending",
        verification_comment: seller.verification_comment || "",
        trust_score: Number(seller.trust_score || 60),
        seller_level: seller.seller_level || "New Seller",
        reward_points: Number(seller.reward_points || 0),
        wallet_balance: Number(seller.wallet_balance || 0),
        pending_payout: Number(seller.pending_payout || 0),
        total_products: stats.totalProducts,
        approved_products: stats.approvedProducts,
        total_orders: Number(seller.total_orders || 0),
        total_sales: Number(seller.total_sales || 0),
        store_logo: seller.store_logo || "",
        store_banner: seller.store_banner || "",
        created_at: seller.createdAt
          ? new Date(seller.createdAt).toISOString()
          : "",
      };
    });

    return NextResponse.json({
      success: true,
      sellers: formattedSellers,
      stats: {
        totalSellers: formattedSellers.length,
        approvedSellers: formattedSellers.filter(
          (s) => s.status === "Approved"
        ).length,
        pendingSellers: formattedSellers.filter(
          (s) => s.status === "Pending"
        ).length,
        suspendedSellers: formattedSellers.filter(
          (s) => s.status === "Suspended"
        ).length,
      },
    });
  } catch (error: any) {
    console.error("Admin Sellers Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to fetch sellers",
      },
      { status: 500 }
    );
  }
}