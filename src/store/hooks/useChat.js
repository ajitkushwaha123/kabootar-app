import { useDispatch, useSelector } from "react-redux";
import {
  addMessage,
  clearMessages,
  updateMessageStatus,
} from "../slices/chatSlice";
import { useOrganization, useUser } from "@clerk/nextjs";
import { sendMessage as sendMessageThunk } from "../slices/chatSlice";

export const useChat = () => {
  const messages = useSelector((state) => state.chat.messages);
  const dispatch = useDispatch();

  const { organization } = useOrganization();
  const { user } = useUser();

  const addLocalMessage = (messageData) => {
    if (!user) return console.warn("User not found");

    const timestamp = new Date().toISOString();

    const newMessage = {
      _id: crypto.randomUUID(),
      leadId: messageData.leadId || "lead123",
      conversationId: messageData.conversationId || "conv123",
      organizationId: organization?.id || "org123",
      senderId: user?.id || "user123",
      senderType: "agent",
      direction: "outgoing",
      status: "pending",
      createdAt: timestamp,
      updatedAt: timestamp,
      isDeleted: false,
      ...messageData,
      metadata: messageData.metadata || {},
    };

    dispatch(addMessage(newMessage));

    return newMessage;
  };

  const sendMessage = async (messageData) => {
    const localMessage = addLocalMessage(messageData);

    try {
      const response = await dispatch(
        sendMessageThunk({
          ...localMessage,
        })
      ).unwrap();

      dispatch(
        updateMessageStatus({
          _id: localMessage._id,
          status: response?.status || "sent",
        })
      );
    } catch (err) {
      dispatch(
        updateMessageStatus({
          _id: localMessage._id,
          status: "failed",
        })
      );
      console.error("Failed to send message:", err);
    }
  };

  return {
    messages,
    addLocalMessage,
    sendMessage,
    updateMessageStatus: (payload) => dispatch(updateMessageStatus(payload)),
    clearMessages: () => dispatch(clearMessages()),
  };
};
