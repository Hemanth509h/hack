import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isOpen: false,
  isTyping: false,
  messages: [],
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    toggleChat: (state) => {
      state.isOpen = !state.isOpen;
      // Add welcome message if opening for the first time and it's empty
      if (state.isOpen && state.messages.length === 0) {
        state.messages.push({
          id: 'welcome-1',
          sender: 'bot',
          text: 'Hi there I am Nexus, the Campus AI Assistant. How can I help you today?',
          timestamp: new Date().toISOString()
        });
      }
    },
    setChatOpen: (state, action) => {
      state.isOpen = action.payload;
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload);
      // Persist history constraint
      if (state.messages.length > 50) {
         state.messages.shift();
      }
    },
    setTyping: (state, action) => {
      state.isTyping = action.payload;
    },
    clearHistory: (state) => {
      state.messages = [
        {
          id: 'welcome-reset',
          sender: 'bot',
          text: 'Conversation cleared How can I assist you now?',
          timestamp: new Date().toISOString()
        }
      ];
    },
  },
});

export const { toggleChat, setChatOpen, addMessage, setTyping, clearHistory } = chatSlice.actions;
export default chatSlice.reducer;
