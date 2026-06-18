import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import Seller from "@/models/Seller";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const sellerId = searchParams.get("seller_id");

    if (!sellerId) {
      return NextResponse.json(
        {
          success: false,
          message: "seller_id required",
        },
        { status: 400 }
      );
    }

    const seller: any = await Seller.findById(sellerId).lean();

    const orders: any[] = await Order.find({
      "items.seller_id": sellerId,
    }).lean();

    const totalOrders = orders.length;

    const cancelledOrders = orders.filter(
      (o: any) => o.status === "Cancelled"
    ).length;

    const deliveredOrders = orders.filter(
      (o: any) => o.status === "Delivered"
    ).length;

    const returnOrders = orders.filter(
      (o: any) =>
        o.return_status === "Requested" ||
        o.return_status === "Approved"
    ).length;

    const shippedOrders = orders.filter(
      (o: any) =>
        o.status === "Shipped" ||
        o.status === "Delivered"
    ).length;

    const cancellationRate =
      totalOrders > 0
        ? Number(
            (
              (cancelledOrders / totalOrders) *
              100
            ).toFixed(1)
          )
        : 0;

    const returnRate =
      totalOrders > 0
        ? Number(
            (
              (returnOrders / totalOrders) *
              100
            ).toFixed(1)
          )
        : 0;

    const onTimeShipping =
      totalOrders > 0
        ? Math.min(
            100,
            Math.round(
              (shippedOrders / totalOrders) *
                100
            )
          )
        : 100;

    const lateDispatchRate =
      Math.max(
        0,
        100 - onTimeShipping
      );

    const customerRating =
      Math.round(
        Number(seller?.rating || 4.2) * 20
      );

    const trustScore =
      Number(
        seller?.trust_score || 60
      );

    const orderQuality =
      Math.max(
        50,
        100 -
          cancellationRate -
          returnRate
      );

    return NextResponse.json({
      success: true,

      trustScore,
      customerRating,
      orderQuality,

      onTimeShipping,
      lateDispatchRate,

      cancellationRate,
      returnRate,

      totalOrders,
      deliveredOrders,
      cancelledOrders,
      returnOrders,
    });
  } catch (error: any) {
    console.error(
      "Seller performance error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error.message ||
          "Server error",
      },
      {
        status: 500,
      }
    );
  }
}