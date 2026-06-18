import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import ProductApprovalLog from "@/models/ProductApprovalLog";

export const dynamic = "force-dynamic";

function text(value: any) {
  if (value === undefined || value === null) return "";
  return String(value).trim();
}

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();

    const productId = text(body.product_id);
    const comment = text(body.comment) || "Approved by admin";

    if (!productId) {
      return NextResponse.json(
        { success: false, message: "product_id required" },
        { status: 400 }
      );
    }

    const product: any = await Product.findById(productId);

    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    product.status = "Approved";
    product.approval_comment = comment;
    product.reject_reason = "";
    product.approved_at = new Date();
    product.rejected_at = null;

    await product.save();

    await ProductApprovalLog.create({
      product_id: String(product._id),
      seller_id: product.seller_id || "",
      seller_store_name: product.seller_store_name || "",
      product_name: product.name || "",
      sku: product.sku || "",
      action: "Approved",
      comment,
      reason: "",
      ai_score: product.ai_score || 0,
    });

    return NextResponse.json({
      success: true,
      message: "Product approved",
      product,
    });
  } catch (error: any) {
    console.error("Product approve error:", error);

    return NextResponse.json(
      { success: false, message: error.message || "Server error" },
      { status: 500 }
    );
  }
}