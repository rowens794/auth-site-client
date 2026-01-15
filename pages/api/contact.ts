import type { NextApiRequest, NextApiResponse } from "next";
import { saveContactMessage, getSiteId } from "../../lib/db";
import { strictRateLimit } from "../../lib/rate-limit";

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

  // Apply rate limiting (5 requests per minute)
  const allowed = await strictRateLimit(req, res);
  if (!allowed) return;

  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      error: "Name, email, and message are required",
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
    const result = await saveContactMessage({
      siteId,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      message: message.trim(),
    });

    if (result.success) {
      return res.status(200).json({
        success: true,
        message: "Message sent successfully",
      });
    } else {
      return res.status(500).json({
        success: false,
        error: result.error || "Failed to send message",
      });
    }
  } catch (error) {
    console.error("Contact form error:", error);
    return res.status(500).json({
      success: false,
      error: "An unexpected error occurred",
    });
  }
}
