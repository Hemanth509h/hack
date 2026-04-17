import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AdminState {
  isSidebarOpen: boolean;
  dateRange: string; // e.g., 'Last 7 Days', 'This Month', 'All Time'
  usersViewContext: {
    searchQuery: string;
    roleFilter: string;
    statusFilter: string;
  };
}

const initialState: AdminState = {
  isSidebarOpen: true,
  dateRange: 'this-week',
  usersViewContext: {
    searchQuery: '',
    roleFilter: 'all',
    statusFilter: 'all',
  },
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.isSidebarOpen = action.payload;
    },
    setDateRange: (state, action: PayloadAction<string>) => {
      state.dateRange = action.payload;
    },
    setUsersSearchQuery: (state, action: PayloadAction<string>) => {
      state.usersViewContext.searchQuery = action.payload;
    },
    setUsersRoleFilter: (state, action: PayloadAction<string>) => {
      state.usersViewContext.roleFilter = action.payload;
    },
    setUsersStatusFilter: (state, action: PayloadAction<string>) => {
      state.usersViewContext.statusFilter = action.payload;
    },
    clearUsersFilters: (state) => {
      state.usersViewContext = initialState.usersViewContext;
    },
  },
});

export const {
  toggleSidebar,
  setSidebarOpen,
  setDateRange,
  setUsersSearchQuery,
  setUsersRoleFilter,
  setUsersStatusFilter,
  clearUsersFilters,
} = adminSlice.actions;

export default adminSlice.reducer;
