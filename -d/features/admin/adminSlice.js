import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isSidebarOpen: true,
  dateRange: "this-week",
  usersViewContext: {
    searchQuery: "",
    roleFilter: "all",
    statusFilter: "all",
  },
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
    setSidebarOpen: (state, action) => {
      state.isSidebarOpen = action.payload;
    },
    setDateRange: (state, action) => {
      state.dateRange = action.payload;
    },
    setUsersSearchQuery: (state, action) => {
      state.usersViewContext.searchQuery = action.payload;
    },
    setUsersRoleFilter: (state, action) => {
      state.usersViewContext.roleFilter = action.payload;
    },
    setUsersStatusFilter: (state, action) => {
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
