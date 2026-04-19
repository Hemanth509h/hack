import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  unreadCount: 0,
  preferences: null,
  toastQueue: [],
};

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    setUnreadCount: (state, action) => {
      state.unreadCount = action.payload;
    },
    incrementUnread: (state) => {
      state.unreadCount += 1;
    },
    decrementUnread: (state) => {
      state.unreadCount = Math.max(0, state.unreadCount - 1);
    },
    setPreferences: (state, action) => {
      state.preferences = action.payload;
    },
    addToast: (state, action) => {
      state.toastQueue.push({
        ...action.payload, id: Math.random().toString(36).substring(2, 9),
      });
    },
    removeToast: (state, action) => {
      state.toastQueue = state.toastQueue.filter((t) => t.id !== action.payload);
    },
  },
});

export const {
  setUnreadCount,
  incrementUnread,
  decrementUnread,
  setPreferences,
  addToast,
  removeToast,
} = notificationSlice.actions;

export default notificationSlice.reducer;
