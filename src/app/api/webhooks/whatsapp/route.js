import crypto from "crypto";
import { NextResponse } from "next/server";

/**
 * ✅ Verify Meta Webhook Setup (GET)
 */
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === process.env.META_WEBHOOK_VERIFY_TOKEN) {
    return new NextResponse(challenge, { status: 200 });
  }

  return new NextResponse("Forbidden", { status: 403 });
}

function verifySignature(rawBody, signature) {
  const appSecret = process.env.WHATSAPP_APP_SECRET;
  if (!appSecret || !signature) return false;

  const hmac = crypto.createHmac("sha256", appSecret);
  hmac.update(rawBody, "utf8");
  const expectedSignature = "sha256=" + hmac.digest("hex");

  try {
    return crypto.timingSafeEqual(
      Buffer.from(expectedSignature),
      Buffer.from(signature)
    );
  } catch {
    return false;
  }
}

/**
 * ✅ Handle Webhook Events (POST)
 */
export async function POST(req) {
  const rawBody = await req.text(); // keep raw body for signature
  const signature = req.headers.get("x-hub-signature-256");

  if (!verifySignature(rawBody, signature)) {
    return new NextResponse("Invalid signature", { status: 403 });
  }

  const body = JSON.parse(rawBody);

  // 🔹 Capture and process event
  if (body.object === "whatsapp_business_account") {
    const entry = body.entry?.[0];
    const changes = entry?.changes?.[0]?.value;

    if (changes?.messages) {
      for (const msg of changes.messages) {
        console.log("📩 Incoming message:", msg);
        // TODO: Save to DB or enqueue for processing
      }
    }

    if (changes?.statuses) {
      for (const status of changes.statuses) {
        console.log("📡 Status update:", status);
        // TODO: Update message status in DB
      }
    }
  }

  return NextResponse.json({ success: true });
}
