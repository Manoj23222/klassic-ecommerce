import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import Product from "@/models/Product";

export async function POST(request: Request) {
  try {
    await connectDB();

    const body = await request.json();

    const cookieStore = await cookies();
    const userId = cookieStore.get("user_id")?.value || "";

    const {
      total,
      cart,
      customer_name,
      phone,
      address,
      payment_method,
      coupon_code,
      discount,
    } = body;

    if (!cart || cart.length === 0) {
      return NextResponse.json(
        { success: false, message: "Cart is empty" },
        { status: 400 }
      );
    }

    if (!customer_name || !phone || !address) {
      return NextResponse.json(
        { success: false, message: "Customer details required" },
        { status: 400 }
      );
    }

    const productIds = cart.map((item: any) => item._id || item.id);

    const products = await Product.find({
      _id: { $in: productIds },
    }).lean();

    const productMap = new Map(
      products.map((p: any) => [p._id.toString(), p])
    );

    const orderItems = cart.map((item: any) => {
      const productId = String(item._id || item.id);
      const product: any = productMap.get(productId);

      return {
        product_id: productId,
        seller_id: product?.seller_id || "",
        seller_store_name: product?.seller_store_name || "",
        product_name: item.name,
        price: Number(item.price),
        quantity: Number(item.quantity || 1),
        color: item.color || "",
        size: item.size || "",
        image: item.image || "",
        item_status: "Pending",
      };
    });

    const order = await Order.create({
      user_id: userId,
      total_amount: Number(total),
      status: "Pending",
      payment_method: payment_method || "COD",
      customer_name,
      phone,
      address,
      coupon_code: coupon_code || "",
      discount: Number(discount || 0),
      items: orderItems,
    });

    for (const item of orderItems) {
      await Product.updateOne(
        {
          _id: item.product_id,
          stock: { $gte: item.quantity },
        },
        {
          $inc: {
            stock: -item.quantity,
            sales_count: item.quantity,
          },
        }
      );
    }

    return NextResponse.json({
      success: true,
      orderId: order._id.toString(),
    });
  } catch (error: any) {
    console.error("ORDER ERROR:", error);

    return NextResponse.json(
      { success: false, message: error.message || "Order failed" },
      { status: 500 }
    );
  }
}