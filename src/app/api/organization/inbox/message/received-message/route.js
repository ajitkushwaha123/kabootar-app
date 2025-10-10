import dbConnect from "@/lib/dbConnect";
import Contact from "@/models/Contact";
import Conversation from "@/models/Conversation";
import Lead from "@/models/Lead";
import Organization from "@/models/Organization";
import Message from "@/models/Message";
import { NextResponse } from "next/server";
import { handleMessageByType } from "@/helper/webhook-payload/message-handler";

export const POST = async (req) => {
  try {
    await dbConnect();

    const data = await req.json();
    const { contacts, metadata, messages } = data;

    const org = await Organization.findOne({
      phone_number_id: metadata?.phone_number_id,
    });

    if (!org) {
      return NextResponse.json(
        { message: "Organization not found", success: false },
        { status: 404 }
      );
    }

    const { wa_id, profile } = contacts?.[0] || {};
    const messagePayload = messages?.[0] || {};

    if (!wa_id || !messagePayload.id) {
      return NextResponse.json(
        { message: "Invalid message payload", success: false },
        { status: 400 }
      );
    }

    let senderContact = await Contact.findOne({
      primaryPhone: wa_id,
      organizationId: org.org_id,
    });

    if (!senderContact) {
      senderContact = await Contact.create({
        primaryName: profile?.name || "",
        primaryPhone: wa_id,
        organizationId: org.org_id,
        source: messagePayload.referral
          ? "whatsapp_ad"
          : "direct_message_received",
        name: {
          formatted_name: profile?.name || "",
        },
        phone: [{ phone: wa_id, wa_id: wa_id, type: "whatsapp" }],
      });
      console.log("🆕 New sender contact created:", senderContact.primaryPhone);
    }

    console.log("senderContact", senderContact);

    let conversation = await Conversation.findOne({
      contactId: senderContact._id,
      organizationId: org.org_id,
    });

    if (!conversation) {
      conversation = await Conversation.create({
        organizationId: org.org_id,
        contactId: senderContact._id,
        participants: [wa_id],
        status: "open",
        unreadCount: 0,
        lastMessageAt: new Date(),
        lastMessageId: null,
      });
    }

    const message = await handleMessageByType({
      org,
      contact: senderContact,
      conversation,
      messagePayload,
    });

    // ✅ Update conversation metadata
    conversation.lastMessageAt = new Date();
    conversation.lastMessageId = message._id;
    await conversation.save();

    return NextResponse.json(
      { message: "Message processed successfully", success: true },
      { status: 200 }
    );
  } catch (err) {
    console.error("❌ Error processing webhook:", err);
    return NextResponse.json(
      { message: err.message || "Internal Server Error", success: false },
      { status: 500 }
    );
  }
};
