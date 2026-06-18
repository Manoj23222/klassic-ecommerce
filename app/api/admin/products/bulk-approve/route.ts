import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import ProductApprovalLog from "@/models/ProductApprovalLog";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();

    const productIds = Array.isArray(body.product_ids)
      ? body.product_ids
      : [];

    if (productIds.length === 0) {
      return NextResponse.json(
        { success: false, message: "product_ids required" },
        { status: 400 }
      );
    }

    const products = await Product.find({
      _id: { $in: productIds },
      status: "Pending Approval",
    });

    await Product.updateMany(
      { _id: { $in: productIds }, status: "Pending Approval" },
      {
        $set: {
          status: "Approved",
          approval_comment: "Bulk approved by admin",
          reject_reason: "",
          approved_at: new Date(),
          rejected_at: null,
        },
      }
    );

    await ProductApprovalLog.insertMany(
      products.map((product: any) => ({
        product_id: String(product._id),
        seller_id: product.seller_id || "",
        seller_store_name: product.seller_store_name || "",
        product_name: product.name || "",
        sku: product.sku || "",
        action: "Approved",
        comment: "Bulk approved by admin",
      }))
    );

    return NextResponse.json({
      success: true,
      message: "Products bulk approved",
      approvedCount: products.length,
    });
  } catch (error: any) {
    console.error("Bulk approve error:", error);

    return NextResponse.json(
      { success: false, message: error.message || "Server error" },
      { status: 500 }
    );
  }
}