import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import Product from "@/models/Product";
import Category from "@/models/Category";
import Payout from "@/models/Payout";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    await connectDB();

    const deliveredOrders = await Order.find({
      status: "Delivered",
    }).lean();

    const categories = await Category.find({}).lean();

    const commissionMap = new Map(
      categories.map((cat: any) => [
        cat.name,
        Number(cat.commissionRate || 5),
      ])
    );

    let createdCount = 0;

    for (const order of deliveredOrders as any[]) {
      const sellerGroups: Record<string, any[]> = {};

      for (const item of order.items || []) {
        if (!item.seller_id) continue;

        if (!sellerGroups[item.seller_id]) {
          sellerGroups[item.seller_id] = [];
        }

        sellerGroups[item.seller_id].push(item);
      }

      for (const sellerId of Object.keys(sellerGroups)) {
        const exists = await Payout.findOne({
          order_id: String(order._id),
          seller_id: sellerId,
        });

        if (exists) continue;

        const items = sellerGroups[sellerId];

        const saleAmount = items.reduce(
          (sum: number, item: any) =>
            sum + Number(item.price || 0) * Number(item.quantity || 1),
          0
        );

        const firstItem = items[0];
        const product = firstItem?.product_id
          ? await Product.findById(firstItem.product_id).lean()
          : null;

        const categoryName =
          product?.category || firstItem?.category || "General";

        const commissionRate =
          commissionMap.get(categoryName) || 5;

        const commissionAmount = Math.round(
          (saleAmount * commissionRate) / 100
        );

        const shippingCharge = 0;

        const payoutAmount =
          saleAmount - commissionAmount - shippingCharge;

        await Payout.create({
          seller_id: sellerId,
          seller_store_name:
            firstItem.seller_store_name || "Klassic Seller",

          order_id: String(order._id),

          sale_amount: saleAmount,
          commission_rate: commissionRate,
          commission_amount: commissionAmount,
          shipping_charge: shippingCharge,
          payout_amount: payoutAmount,

          status: "Pending",
          notes: "Auto generated from delivered order",
        });

        createdCount++;
      }
    }

    return NextResponse.json({
      success: true,
      message: "Payouts generated",
      createdCount,
    });
  } catch (error: any) {
    console.error("Generate payouts error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Server error",
      },
      { status: 500 }
    );
  }
}