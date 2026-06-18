import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";

export const dynamic = "force-dynamic";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;
    const formData = await req.formData();

    const reason = String(formData.get("reason") || "").trim();
    const message = String(formData.get("message") || "").trim();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.redirect(new URL("/my-orders", req.url));
    }

    if (!reason) {
      return NextResponse.redirect(new URL(`/my-orders/${id}/return`, req.url));
    }

    const order: any = await Order.findById(id);

    if (!order) {
      return NextResponse.redirect(new URL("/my-orders", req.url));
    }

    if (order.status !== "Delivered") {
      return NextResponse.redirect(new URL(`/my-orders/${id}`, req.url));
    }

    if (order.return_status === "Requested") {
      return NextResponse.redirect(new URL(`/my-orders/${id}`, req.url));
    }

    order.status = "Return Requested";
    order.return_status = "Requested";
    order.return_reason = reason;
    order.return_message = message;
    order.return_requested_at = new Date();
    order.refund_status = "Pending";
    order.refund_amount = Number(order.total_amount || 0);

    await order.save();

    return NextResponse.redirect(new URL(`/my-orders/${id}`, req.url));
  } catch (error) {
    console.error("Return request error:", error);
    return NextResponse.redirect(new URL("/my-orders", req.url));
  }
}