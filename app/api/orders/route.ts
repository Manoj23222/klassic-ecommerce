import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import Product from "@/models/Product";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    await connectDB();

    const body = await request.json();

    const cookieStore = await cookies();
    const userId = cookieStore.get("user_id")?.value || "";

    const {
      total,
      subtotal,
      cart,
      customer_name,
      phone,
      address,
      pincode,
      city,
      state,
      landmark,
      address_type,
      payment_method,
      coupon_code,
      discount,
      delivery_charge,
      gst_amount,
    } = body;

    if (!cart || !Array.isArray(cart) || cart.length === 0) {
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

    const productIds = cart
      .map((item: any) => item._id || item.id || item.product_id)
      .filter(Boolean);

    const products = await Product.find({
      _id: { $in: productIds },
    }).lean();

    const productMap = new Map(
      products.map((p: any) => [String(p._id), p])
    );

    const orderItems = cart.map((item: any) => {
      const productId = String(item._id || item.id || item.product_id);
      const product: any = productMap.get(productId);

      return {
        product_id: productId,
        seller_id: product?.seller_id || item.seller_id || "",
        seller_store_name:
          product?.seller_store_name || item.seller_store_name || "",

        product_name: item.name || item.product_name || product?.name || "",
        price: Number(item.price || 0),
        quantity: Number(item.quantity || 1),

        color: item.color || "",
        size: item.size || "",
        image: item.image || product?.image || "",

        item_status: "Pending",
        tracking_number: "",
        courier_name: "",
        delivery_estimate: "",
      };
    });

    const calcSubtotal =
      subtotal !== undefined
        ? Number(subtotal)
        : orderItems.reduce(
            (sum: number, item: any) =>
              sum + Number(item.price || 0) * Number(item.quantity || 1),
            0
          );

    const calcDiscount = Number(discount || 0);
    const calcDeliveryCharge = Number(delivery_charge || 0);
    const calcGst = Number(gst_amount || 0);

    const finalTotal =
      total !== undefined
        ? Number(total)
        : Math.max(calcSubtotal - calcDiscount + calcDeliveryCharge + calcGst, 0);

    const paymentMethod = payment_method || "COD";

    const order = await Order.create({
      user_id: userId,

      customer_name,
      phone,

      address,
      pincode: pincode || "",
      city: city || "",
      state: state || "",
      landmark: landmark || "",
      address_type: address_type || "Home",

      items: orderItems,

      subtotal: calcSubtotal,
      discount: calcDiscount,
      delivery_charge: calcDeliveryCharge,
      gst_amount: calcGst,
      total_amount: finalTotal,

      coupon_code: coupon_code || "",

      payment_method: paymentMethod,
      payment_status: paymentMethod === "COD" ? "Pending" : "Paid",

      status: "Pending",
      order_note: "",
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
      message: "Order placed successfully",
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