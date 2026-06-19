import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function getPaytmHost() {
  return process.env.PAYTM_ENV === "PRODUCTION"
    ? "https://securegw.paytm.in"
    : "https://securegw-stage.paytm.in";
}

export async function POST(req: Request) {
  try {
    const PaytmChecksum = (await import("paytmchecksum")).default;

    const body = await req.json();

    const orderId = `KL_${Date.now()}`;
    const amount = Number(body.amount || 0);

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { success: false, message: "Invalid amount" },
        { status: 400 }
      );
    }

    const mid = process.env.PAYTM_MID || "";
    const key = process.env.PAYTM_MERCHANT_KEY || "";
    const website = process.env.PAYTM_WEBSITE || "WEBSTAGING";

    const paytmParams: any = {
      body: {
        requestType: "Payment",
        mid,
        websiteName: website,
        orderId,
        callbackUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/api/payment/paytm-callback`,
        txnAmount: {
          value: amount.toFixed(2),
          currency: "INR",
        },
        userInfo: {
          custId: body.customerId || "CUST001",
        },
      },
    };

    const checksum = await PaytmChecksum.generateSignature(
      JSON.stringify(paytmParams.body),
      key
    );

    paytmParams.head = {
      signature: checksum,
    };

    const res = await fetch(
      `${getPaytmHost()}/theia/api/v1/initiateTransaction?mid=${mid}&orderId=${orderId}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(paytmParams),
      }
    );

    const data = await res.json();

    return NextResponse.json({
      success: data?.body?.resultInfo?.resultStatus === "S",
      orderId,
      txnToken: data?.body?.txnToken,
      mid,
      amount: amount.toFixed(2),
      raw: data,
    });
  } catch (error: any) {
    console.error("Paytm initiate error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Paytm initiate failed",
      },
      { status: 500 }
    );
  }
}