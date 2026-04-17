import express from "express";
import crypto from "crypto";
const router = express.Router();

router.post("/generate-hash", (req, res) => {
    const { order_id, amount, currency } = req.body;
    
    // IMPORTANT: 
    // merchant_id = The 6-7 digit NUMBER from your Home tab (e.g., "1225441")
    // merchant_secret = The long string from Business Apps (e.g., "MTY4MTM...")
    const merchant_id = "1235222"; 
    const merchant_secret = "NDExNTg5NjAyOTQxMTE0MDg4MjE5OTExODQ2ODE4NDcwMjkyMTQ="; 

    // PayHere requires exactly 2 decimal places (e.g., "1500.00")
    const amountFormatted = parseFloat(amount).toFixed(2);

    // Step 1: Hash the secret
    const hashedSecret = crypto.createHash("md5").update(merchant_secret).digest("hex").toUpperCase();
    
    // Step 2: Create the main MD5 signature
    const mainHash = crypto
        .createHash("md5")
        .update(merchant_id + order_id + amountFormatted + currency + hashedSecret)
        .digest("hex")
        .toUpperCase();

    res.json({ hash: mainHash, merchant_id });
});

export default router;