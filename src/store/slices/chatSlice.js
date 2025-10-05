import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios"; // you forgot to import axios

const initialState = {
  messages: [],
  loading: false,
  error: null,
};

// Async thunk for sending a message
export const sendMessage = createAsyncThunk(
  "chat/sendMessage",
  async (messageData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "/api/organization/message/send-message",
        messageData
      );
      return response.data;
    } catch (err) {
      // Return a rejected value to handle in extraReducers
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    updateMessageStatus: (state, action) => {
      const msg = state.messages.find((m) => m._id === action.payload._id);
      if (msg) msg.status = action.payload.status;
    },
    clearMessages: (state) => {
      state.messages = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.loading = false;
        // state.messages.push(action.payload.data); 
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to send message";
      });
  },
});

export const { addMessage, updateMessageStatus, clearMessages } =
  chatSlice.actions;
export default chatSlice.reducer;
