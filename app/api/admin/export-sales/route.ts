import { NextResponse } from "next/server";
import ExcelJS from "exceljs";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";

export async function GET() {
  await connectDB();

  const orders = await Order.find({})
    .sort({ createdAt: -1 })
    .lean();

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Sales Report");

  worksheet.columns = [
    { header: "Order ID", key: "id", width: 30 },
    { header: "Customer", key: "customer_name", width: 25 },
    { header: "Phone", key: "phone", width: 18 },
    { header: "Total Amount", key: "total_amount", width: 15 },
    { header: "Payment Method", key: "payment_method", width: 18 },
    { header: "Status", key: "status", width: 15 },
    { header: "Coupon", key: "coupon_code", width: 15 },
    { header: "Discount", key: "discount", width: 15 },
    { header: "Date", key: "created_at", width: 25 },
  ];

  orders.forEach((order: any) => {
    worksheet.addRow({
      id: String(order._id),
      customer_name: order.customer_name || "Guest",
      phone: order.phone || "-",
      total_amount: Number(order.total_amount || 0),
      payment_method: order.payment_method || "COD",
      status: order.status || "Pending",
      coupon_code: order.coupon_code || "-",
      discount: Number(order.discount || 0),
      created_at: order.createdAt
        ? new Date(order.createdAt).toLocaleString("en-IN")
        : "",
    });
  });

  worksheet.getRow(1).font = {
    bold: true,
  };

  const buffer = await workbook.xlsx.writeBuffer();

  return new NextResponse(Buffer.from(buffer), {
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition":
        "attachment; filename=sales-report.xlsx",
    },
  });
}