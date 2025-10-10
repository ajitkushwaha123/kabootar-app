import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  conversations: [],
  loading: false,
  error: null,
};

export const fetchConversations = createAsyncThunk(
  "conversation/fetchConversations",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        "/api/organization/inbox/conversation/list"
      );
      return response.data.conversations;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const conversationSlice = createSlice({
  name: "conversation",
  initialState,
  reducers: {
    upsertConversation: (state, action) => {
      const { conversationId, lastMessageId, ...rest } = action.payload;

      // Find if conversation already exists
      const existingIndex = state.conversations.findIndex(
        (conv) => conv._id === conversationId
      );

      if (existingIndex !== -1) {
        // Update lastMessageId of existing conversation
        state.conversations[existingIndex].lastMessageId = lastMessageId;
        // Optionally merge other fields if needed
        Object.assign(state.conversations[existingIndex], rest);
      } else {
        // Insert new conversation
        state.conversations.push({
          _id: conversationId,
          lastMessageId,
          ...rest,
        });
      }
    },

    clearConversations: (state) => {
      state.conversations = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchConversations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.loading = false;
        state.conversations = action.payload;
      })
      .addCase(fetchConversations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch conversations";
      });
  },
});

export const { upsertConversation, clearConversations } =
  conversationSlice.actions;

export default conversationSlice.reducer;
