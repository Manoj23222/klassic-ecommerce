export const paytmConfig = {
  mid: process.env.PAYTM_MID || "",
  key: process.env.PAYTM_MERCHANT_KEY || "",
  website: process.env.PAYTM_WEBSITE || "WEBSTAGING",
  callbackUrl:
    process.env.PAYTM_CALLBACK_URL ||
    "http://localhost:3000/api/payment/paytm/callback",
};