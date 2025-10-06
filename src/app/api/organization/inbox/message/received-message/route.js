import dbConnect from "@/lib/dbConnect";
import Contact from "@/models/Contact";
import { NextResponse } from "next/server";

export const POST = async (req) => {
  try {
    await dbConnect();

    const data = await req.json();
    const { contacts, orgId } = data;
    console.log("Received data:", contacts);

    if (!orgId) {
      return NextResponse.json(
        {
          message: "orgId is required",
          success: false,
        },
        { status: 400 }
      );
    }

    const { wa_id, profile } = contacts?.[0];

    if (!wa_id) {
      return NextResponse.json(
        {
          message: "wa_id is required",
          success: false,
        },
        { status: 400 }
      );
    }

    const isExistingContact = await Contact.findOne({ phone: wa_id });

    if (!isExistingContact) {
      const newContact = new Contact({
        name: profile?.name || "",
        phone: wa_id,
        organizationId: orgId || "",
        source: "whatsapp_ad",
      });

      await newContact.save();
      console.log("New contact created:", newContact);
    }

    return NextResponse.json(
      {
        message: "Contact processed successfully",
        success: true,
      },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      {
        message: err.message || "Internal Server Error",
        success: false,
      },
      { status: 500 }
    );
  }
};
