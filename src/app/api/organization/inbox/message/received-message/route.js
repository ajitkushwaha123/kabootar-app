import dbConnect from "@/lib/dbConnect";
import Contact from "@/models/Contact";
import Conversation from "@/models/Conversation";
import Lead from "@/models/Lead";
import Organization from "@/models/Organization";
import Message from "@/models/Message"; 
import { NextResponse } from "next/server";

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
    const { referral, text, type, id: msgId, timestamp } = messages?.[0] || {};

    if (!wa_id) {
      return NextResponse.json(
        { message: "wa_id is required", success: false },
        { status: 400 }
      );
    }

    // ✅ Handle Contact
    let contact = await Contact.findOne({ phone: wa_id });
    if (!contact) {
      contact = new Contact({
        name: profile?.name || "",
        phone: wa_id,
        organizationId: org.org_id,
        source: "whatsapp_ad",
      });
      await contact.save();
      console.log("New contact created:", contact);
    }

    // ✅ Handle Lead
    let lead = await Lead.findOne({ phone: wa_id });
    if (!lead) {
      lead = new Lead({
        name: profile?.name || "",
        phone: wa_id,
        organizationId: org.org_id,
        source: "whatsapp_ad",
        status: "new",
        adId: referral?.source_id || null,
      });
      await lead.save();
      console.log("New lead created:", lead);
    }

    // ✅ Handle Conversation
    let conversation = await Conversation.findOne({ leadId: lead._id });

    if (!conversation) {
      conversation = new Conversation({
        leadId: lead._id,
        organizationId: org.org_id,
        participants: [wa_id],
        status: "open",
        unreadCount: 0,
        lastMessageAt: new Date(),
        lastMessageId: null,
      });
      await conversation.save();
    }

    // ✅ Create Message
    const message = new Message({
      leadId: lead._id,
      conversationId: conversation._id,
      senderId: wa_id,
      senderType: "lead", // keep consistent
      organizationId: org.org_id,
      direction: "incoming",
      status: "received",
      messageType: type || "text",
      text: type === "text" ? { body: text?.body || "" } : {},
      metadata: {
        msgId,
        timestamp,
        referral,
      },
    });

    await message.save();

    conversation.lastMessageAt = new Date();
    conversation.lastMessageId = message._id;
    await conversation.save();

    return NextResponse.json(
      {
        message: "Contact, Lead, Conversation & Message processed successfully",
        success: true,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error processing contact:", err);
    return NextResponse.json(
      { message: err.message || "Internal Server Error", success: false },
      { status: 500 }
    );
  }
};
