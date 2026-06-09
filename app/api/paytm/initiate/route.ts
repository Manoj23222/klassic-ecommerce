import { NextResponse } from "next/server";
const PaytmChecksum = require("paytmchecksum");
export async function POST(req: Request) {
  try {
    const { orderId, amount, customerId, email, phone } = await req.json();

    const mid = process.env.PAYTM_MID!;
    const merchantKey = process.env.PAYTM_MERCHANT_KEY!;
    const callbackUrl = process.env.PAYTM_CALLBACK_URL!;

    const paytmParams: any = {
      body: {
        requestType: "Payment",
        mid,
        websiteName: process.env.PAYTM_WEBSITE || "WEBSTAGING",
        orderId: String(orderId),
        callbackUrl,
        txnAmount: {
          value: String(amount),
          currency: "INR",
        },
        userInfo: {
          custId: String(customerId || "CUST001"),
          email: email || "",
          mobile: phone || "",
        },
      },
    };

    const checksum = await PaytmChecksum.generateSignature(
      JSON.stringify(paytmParams.body),
      merchantKey
    );

    paytmParams.head = {
      signature: checksum,
    };

    const response = await fetch(
      `https://securegw-stage.paytm.in/theia/api/v1/initiateTransaction?mid=${mid}&orderId=${orderId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paytmParams),
      }
    );

    const data = await response.json();

    return NextResponse.json({
      success: true,
      data,
      orderId,
      mid,
      amount,
    });
  } catch (error) {
    console.error("PAYTM INITIATE ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Paytm initiate failed" },
      { status: 500 }
    );
  }
}