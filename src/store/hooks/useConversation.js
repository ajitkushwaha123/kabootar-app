import { useOrganization, useUser } from "@clerk/nextjs";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchConversations,
  upsertConversation,
  clearConversations,
} from "../slices/conversationSlice";

export const useConversation = () => {
  const dispatch = useDispatch();
  const { conversations } = useSelector((state) => state.conversation);

  const { organization } = useOrganization();
  const { user } = useUser();

  // Fetch all conversations
  const getConversations = async () => {
    await dispatch(fetchConversations());
  };

  // Add or update a conversation
  const addOrUpdateConversation = (conversationData) => {
    dispatch(upsertConversation(conversationData));
  };

  // Clear all conversations
  const clearAllConversations = () => {
    dispatch(clearConversations());
  };

  return {
    conversations,
    getConversations,
    addOrUpdateConversation,
    clearAllConversations,
    user,
    organization,
  };
};
