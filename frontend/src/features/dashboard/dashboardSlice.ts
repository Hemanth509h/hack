import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface DashboardState {
  isNotificationPanelOpen: boolean;
  activeCarouselIndex: number;
}

const initialState: DashboardState = {
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
    setNotificationPanelOpen: (state, action: PayloadAction<boolean>) => {
      state.isNotificationPanelOpen = action.payload;
    },
    setActiveCarouselIndex: (state, action: PayloadAction<number>) => {
      state.activeCarouselIndex = action.payload;
    },
  },
});

export const { toggleNotificationPanel, setNotificationPanelOpen, setActiveCarouselIndex } = dashboardSlice.actions;
export default dashboardSlice.reducer;
