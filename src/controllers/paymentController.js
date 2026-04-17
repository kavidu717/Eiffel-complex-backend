import crypto from "crypto";

export const generatePayHereHash = async (req, res) => {
  const { order_id, amount, currency } = req.body;

  const merchant_id = process.env.PAYHERE_MERCHANT_ID; // Your numeric ID
  const merchant_secret = process.env.PAYHERE_MERCHANT_SECRET; // Your long string secret

  // 1. Format amount to 2 decimal places
  const amountFormatted = parseFloat(amount).toFixed(2);

  // 2. Calculate Hash
  const hashedSecret = crypto.createHash("md5").update(merchant_secret).digest("hex").toUpperCase();
  const hash = crypto
    .createHash("md5")
    .update(merchant_id + order_id + amountFormatted + currency + hashedSecret)
    .digest("hex")
    .toUpperCase();

  res.json({ hash, merchant_id });
};