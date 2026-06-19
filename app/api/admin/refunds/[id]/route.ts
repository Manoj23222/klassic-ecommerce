import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;
    const body = await req.json();

    const { refund_status } = body;

    if (!["Completed", "Rejected"].includes(refund_status)) {
      return NextResponse.json(
        { success: false, message: "Invalid refund status" },
        { status: 400 }
      );
    }

    const order: any = await Order.findById(id);

    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }

    order.refund_status = refund_status;

    if (refund_status === "Completed") {
      order.status = "Refunded";
      order.payment_status = "Refunded";

      for (const item of order.items || []) {
        item.item_status = "Return Approved";
      }
    }

    if (refund_status === "Rejected") {
      order.status = "Return Rejected";
      order.payment_status = order.payment_status || "Paid";

      for (const item of order.items || []) {
        item.item_status = "Delivered";
      }
    }

    await order.save();

    return NextResponse.json({
      success: true,
      message:
        refund_status === "Completed"
          ? "Refund marked as completed"
          : "Refund rejected",
      order,
    });
  } catch (error) {
    console.error("Refund update error:", error);

    return NextResponse.json(
      { success: false, message: "Refund update failed" },
      { status: 500 }
    );
  }
}