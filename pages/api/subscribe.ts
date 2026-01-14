import type { NextApiRequest, NextApiResponse } from "next";
import { saveEmailSubscription, getSiteId } from "../../lib/db";

type ResponseData = {
  success: boolean;
  message?: string;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      success: false,
      error: "Email is required",
    });
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      error: "Invalid email address",
    });
  }

  try {
    const siteId = getSiteId();
    const result = await saveEmailSubscription({
      siteId,
      email: email.trim().toLowerCase(),
    });

    if (result.success) {
      return res.status(200).json({
        success: true,
        message: "Successfully subscribed!",
      });
    } else {
      return res.status(400).json({
        success: false,
        error: result.error || "Failed to subscribe",
      });
    }
  } catch (error) {
    console.error("Subscribe error:", error);
    return res.status(500).json({
      success: false,
      error: "An unexpected error occurred",
    });
  }
}
