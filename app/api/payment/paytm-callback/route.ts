import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const orderId = String(formData.get("ORDERID") || "");
    const txnId = String(formData.get("TXNID") || "");
    const status = String(formData.get("STATUS") || "");
    const amount = String(formData.get("TXNAMOUNT") || "");

    const redirectUrl =
      status === "TXN_SUCCESS"
        ? `/checkout?paytm_status=success&paytm_order_id=${orderId}&paytm_txn_id=${txnId}&amount=${amount}`
        : `/checkout?paytm_status=failed&paytm_order_id=${orderId}`;

    return NextResponse.redirect(new URL(redirectUrl, req.url));
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Paytm callback failed" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    message: "Paytm callback route active",
  });
}