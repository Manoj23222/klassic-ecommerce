import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const formData = await request.formData();

  const data: any = {};
  formData.forEach((value, key) => {
    data[key] = value;
  });

  console.log("PAYTM CALLBACK:", data);

  return NextResponse.redirect(
    new URL(`/order-success?orderId=${data.ORDERID || ""}`, request.url)
  );
}