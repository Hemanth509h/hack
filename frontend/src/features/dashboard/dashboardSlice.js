import { createSlice } from '@reduxjs/toolkit';



const initialState = {
  isNotificationPanelOpen: false,
  activeCarouselIndex: 0,
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    toggleNotificationPanel: (state) => {
      state.isNotificationPanelOpen = !state.isNotificationPanelOpen;
    },
    setNotificationPanelOpen: (state, action) => {
      state.isNotificationPanelOpen = action.payload;
    },
    setActiveCarouselIndex: (state, action) => {
      state.activeCarouselIndex = action.payload;
    },
  },
});

export const { toggleNotificationPanel, setNotificationPanelOpen, setActiveCarouselIndex } = dashboardSlice.actions;
export default dashboardSlice.reducer;
