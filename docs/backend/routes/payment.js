/**
 * SkipCash Payment Routes
 *
 * POST /api/payment/skipcash/create-payment
 *   - Frontend calls this to initiate a payment session with SkipCash
 *   - Returns { success, data: { paymentUrl, transactionId, paymentId } }
 *
 * GET /api/payment/skipcash/verify/:orderId?id=:paymentId
 *   - SkipCash redirects browser here after user completes payment
 *   - Verifies status with SkipCash then redirects browser to frontend:
 *     paid   → 302 → CLIENT_URL/payment/success?orderId=:orderId
 *     failed → 302 → CLIENT_URL/payment/failed?orderId=:orderId
 *     pending→ 302 → CLIENT_URL/payment/pending?orderId=:orderId
 */

const express = require("express");
const router = express.Router();
const https = require("https");
const http = require("http");

const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";
const SKIPCASH_BASE_URL = (process.env.SKIPCASH_BASE_URL || "https://skipcashtest.azurewebsites.net").replace(/\/+$/, "");

/**
 * Minimal HTTPS request helper (no extra dependencies)
 */
function httpsRequest(url, options, body) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const opts = {
      hostname: urlObj.hostname,
      port: urlObj.port || 443,
      path: urlObj.pathname + urlObj.search,
      method: options.method || "GET",
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      rejectUnauthorized: false,
    };

    const lib = urlObj.protocol === "https:" ? https : http;
    const req = lib.request(opts, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, data });
        }
      });
    });

    req.on("error", reject);

    if (body) {
      req.write(typeof body === "string" ? body : JSON.stringify(body));
    }
    req.end();
  });
}

/**
 * POST /api/payment/skipcash/create-payment
 * Initiates a SkipCash payment session and returns the payment URL to the frontend.
 */
router.post("/skipcash/create-payment", async (req, res) => {
  try {
    const { orderId, amount, customerName, email, phone } = req.body;

    console.log("[SkipCash Create] orderId=%s amount=%s customer=%s", orderId, amount, customerName);

    if (!orderId || !amount || !customerName || !email) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: orderId, amount, customerName, email",
      });
    }

    const callbackUrl = `${CLIENT_URL}/payment/success?orderId=${orderId}`;
    const failUrl = `${CLIENT_URL}/payment/failed?orderId=${orderId}`;

    const payload = {
      amount: Math.round(amount),
      customer_name: customerName,
      customer_email: email,
      customer_phone: phone,
      transaction_id: orderId,
      callback_url: callbackUrl,
      fail_url: failUrl,
      client_id: process.env.SKIPCASH_CLIENT_ID,
    };

    const result = await httpsRequest(
      `${SKIPCASH_BASE_URL}/api/create-payment`,
      {
        method: "POST",
        headers: {
          "Client-Id": process.env.SKIPCASH_CLIENT_ID,
          "X-Auth-Key": process.env.SKIPCASH_KEY_ID,
        },
      },
      payload
    );

    if (result.status >= 200 && result.status < 300 && result.data) {
      return res.json({
        success: true,
        data: {
          paymentUrl:
            result.data.payment_url ||
            result.data.paymentUrl ||
            result.data.redirect_url,
          transactionId:
            result.data.transaction_id || result.data.transactionId,
          paymentId:
            result.data.payment_id || result.data.paymentId || result.data.id,
        },
        message: "SkipCash payment initiated successfully",
      });
    }

    console.error("[SkipCash Create] failed:", result.status, JSON.stringify(result.data));
    return res.status(502).json({
      success: false,
      message: "SkipCash gateway error",
    });
  } catch (error) {
    console.error("[SkipCash Create] error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to initiate payment",
    });
  }
});

/**
 * GET /api/payment/skipcash/verify/:orderId?id=:paymentId
 *
 * Called when SkipCash redirects the USER'S BROWSER back to our backend
 * after payment (this is NOT an API call from frontend — it's a browser
 * navigation). We verify the status, then REDIRECT the browser to the
 * appropriate frontend page via HTTP 302.
 */
router.get("/skipcash/verify/:orderId", async (req, res) => {
  console.log("=== VERIFY CONTROLLER HIT ===");
  console.log("Params:", JSON.stringify(req.params));
  console.log("Query:", JSON.stringify(req.query));

  try {
    const { orderId } = req.params;
    const paymentId =
      req.query.id || req.query.paymentId || req.query.transactionId || orderId;

    if (!orderId) {
      const url = `${CLIENT_URL}/payment/failed?error=missing_order`;
      console.log("VERIFY REDIRECT URL (no orderId):", url);
      return res.redirect(url);
    }

    // Call SkipCash verify API
    const verifyPayload = {
      transaction_id: orderId,
      payment_id: paymentId,
    };

    console.log("Calling SkipCash verify with:", JSON.stringify(verifyPayload));

    const result = await httpsRequest(
      `${SKIPCASH_BASE_URL}/api/verify`,
      {
        method: "POST",
        headers: {
          "Client-Id": process.env.SKIPCASH_CLIENT_ID,
          "X-Auth-Key": process.env.SKIPCASH_KEY_ID,
        },
      },
      verifyPayload
    );

    console.log("SkipCash verify raw response:", JSON.stringify(result.data));

    // IMPORTANT: SkipCash returns { success, data: { status } }
    // so status is at result.data.data.status
    const responseBody = result.data || {};
    const innerData = responseBody.data || {};
    const rawStatus =
      innerData.status ||
      responseBody.status ||
      responseBody.payment_status ||
      "pending";
    const status = rawStatus.toLowerCase();

    console.log("VERIFY REDIRECT STATUS:", status);

    let redirectUrl;
    if (status === "paid" || status === "completed" || status === "success") {
      redirectUrl = `${CLIENT_URL}/payment/success?orderId=${orderId}`;
    } else if (
      status === "failed" ||
      status === "cancelled" ||
      status === "rejected"
    ) {
      redirectUrl = `${CLIENT_URL}/payment/failed?orderId=${orderId}`;
    } else {
      redirectUrl = `${CLIENT_URL}/payment/pending?orderId=${orderId}`;
    }

    console.log("VERIFY REDIRECT URL:", redirectUrl);
    console.log("Executing res.redirect(302) ...");
    return res.redirect(redirectUrl);
  } catch (error) {
    console.error("[SkipCash Verify] error:", error);
    const url = `${CLIENT_URL}/payment/failed?orderId=${req.params.orderId}&error=verification_error`;
    console.log("VERIFY REDIRECT URL (error):", url);
    return res.redirect(url);
  }
});

/**
 * GET /api/payment/skipcash/status/:orderId
 * Returns the payment status as JSON (used by frontend polling).
 * This is a READ-ONLY endpoint — no side effects.
 */
router.get("/skipcash/status/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;

    if (!orderId) {
      return res.json({ success: false, status: "failed" });
    }

    const verifyPayload = {
      transaction_id: orderId,
      payment_id: orderId,
    };

    const result = await httpsRequest(
      `${SKIPCASH_BASE_URL}/api/verify`,
      {
        method: "POST",
        headers: {
          "Client-Id": process.env.SKIPCASH_CLIENT_ID,
          "X-Auth-Key": process.env.SKIPCASH_KEY_ID,
        },
      },
      verifyPayload
    );

    const responseBody = result.data || {};
    const innerData = responseBody.data || {};
    const rawStatus =
      innerData.status ||
      responseBody.status ||
      responseBody.payment_status ||
      "pending";
    const status = rawStatus.toLowerCase();

    return res.json({
      success: true,
      orderId,
      status,
    });
  } catch (error) {
    console.error("[SkipCash Status] error:", error);
    return res.json({ success: false, orderId: req.params.orderId, status: "failed" });
  }
});

/**
 * POST /api/payment/skipcash/retry/:orderId
 * Called when user clicks "Pay Now" for a failed/pending payment.
 * Looks up the existing order from the database, creates a new SkipCash
 * payment session, and returns { success, checkoutUrl }.
 * Does NOT modify the order or create a new one.
 */
router.post("/skipcash/retry/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;

    console.log("[SkipCash Retry] orderId=%s", orderId);

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "Missing orderId",
      });
    }

    // Look up the existing order to retrieve amount and customer info
    let Order;
    try {
      Order = require("../models/Order");
    } catch {
      return res.status(500).json({
        success: false,
        message: "Order model not available",
      });
    }

    const order = await Order.findOne({
      $or: [{ _id: orderId }, { orderId }, { transaction_id: orderId }],
    });

    if (!order) {
      console.error("[SkipCash Retry] order not found:", orderId);
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const amount = order.totalAmount || order.total || 0;
    const customerName = order.customerName || order.customer_name || order.shippingAddress?.name || "Customer";
    const email = order.email || order.customer_email || "";
    const phone = order.phone || order.customer_phone || "";

    if (!amount || !customerName || !email) {
      return res.status(400).json({
        success: false,
        message: "Order is missing required payment fields (amount, customer info)",
      });
    }

    console.log("[SkipCash Retry] amount=%s customer=%s", amount, customerName);

    const callbackUrl = `${CLIENT_URL}/payment/success?orderId=${orderId}`;
    const failUrl = `${CLIENT_URL}/payment/failed?orderId=${orderId}`;

    const payload = {
      amount: Math.round(amount),
      customer_name: customerName,
      customer_email: email,
      customer_phone: phone,
      transaction_id: orderId,
      callback_url: callbackUrl,
      fail_url: failUrl,
      client_id: process.env.SKIPCASH_CLIENT_ID,
    };

    const result = await httpsRequest(
      `${SKIPCASH_BASE_URL}/api/create-payment`,
      {
        method: "POST",
        headers: {
          "Client-Id": process.env.SKIPCASH_CLIENT_ID,
          "X-Auth-Key": process.env.SKIPCASH_KEY_ID,
        },
      },
      payload
    );

    if (result.status >= 200 && result.status < 300 && result.data) {
      const checkoutUrl =
        result.data.payment_url ||
        result.data.paymentUrl ||
        result.data.redirect_url;

      if (!checkoutUrl) {
        console.error("[SkipCash Retry] no payment_url in response:", JSON.stringify(result.data));
        return res.status(502).json({
          success: false,
          message: "SkipCash did not return a payment URL",
        });
      }

      return res.json({
        success: true,
        checkoutUrl,
      });
    }

    console.error("[SkipCash Retry] failed:", result.status, JSON.stringify(result.data));
    return res.status(502).json({
      success: false,
      message: "SkipCash gateway error",
    });
  } catch (error) {
    console.error("[SkipCash Retry] error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retry payment",
    });
  }
});

module.exports = router;
