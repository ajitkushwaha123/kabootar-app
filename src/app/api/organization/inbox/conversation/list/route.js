import dbConnect from "@/lib/dbConnect";
import Conversation from "@/models/Conversation";
import Lead from "@/models/Lead";
import Message from "@/models/Message";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    await dbConnect();

    const { orgId } = await auth(); // no need to await; it’s a sync helper in server components
    if (!orgId) {
      return NextResponse.json(
        { message: "Organization ID missing", success: false },
        { status: 400 }
      );
    }

    // ✅ Efficient query with projections and sorting
    const conversations = await Conversation.find({
      organizationId: orgId,
      isDeleted: false,
    })
      .populate("leadId", "name phone status")
      .populate("lastMessageId")
      .sort({ lastMessageAt: -1 })
      .lean();

    return NextResponse.json(
      {
        message: "Conversations fetched successfully",
        conversations,
        success: true,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error fetching conversations:", err);
    return NextResponse.json(
      {
        message: err.message || "Internal server error",
        success: false,
      },
      { status: 500 }
    );
  }
};
