import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import Seller from "@/models/Seller";
import WalletTransaction from "@/models/WalletTransaction";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;
    const body = await req.json();

    const { return_status } = body;

    if (!["Approved", "Rejected"].includes(return_status)) {
      return NextResponse.json(
        { success: false, message: "Invalid return status" },
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

    order.return_status = return_status;

    if (return_status === "Approved") {
      order.status = "Return Approved";
      order.refund_status = "Pending";
      order.refund_amount = Number(order.total_amount || 0);

      for (const item of order.items || []) {
        item.item_status = "Return Approved";

        if (item.seller_id) {
          const refundAmount =
            Number(item.price || 0) * Number(item.quantity || 1);

          await Seller.findByIdAndUpdate(item.seller_id, {
            $inc: {
              wallet_balance: -refundAmount,
              pending_payout: -refundAmount,
            },
          });

          await WalletTransaction.create({
            seller_id: item.seller_id,
            seller_store_name: item.seller_store_name || "",
            type: "Debit",
            amount: refundAmount,
            reason: "Return Refund",
            order_id: String(order._id),
            status: "Completed",
            note: `Refund debit for returned order ${String(order._id).slice(
              -6
            )}`,
          });
        }
      }
    }

    if (return_status === "Rejected") {
      order.status = "Return Rejected";
      order.refund_status = "Rejected";

      for (const item of order.items || []) {
        item.item_status = "Delivered";
      }
    }

    await order.save();

    return NextResponse.json({
      success: true,
      message:
        return_status === "Approved"
          ? "Return approved and refund wallet automation completed"
          : "Return rejected successfully",
      order,
    });
  } catch (error) {
    console.error("Return automation error:", error);

    return NextResponse.json(
      { success: false, message: "Return update failed" },
      { status: 500 }
    );
  }
}