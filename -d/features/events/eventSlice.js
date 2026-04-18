import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  searchQuery: "",
  selectedCategory: "All Events",
  viewMode: "grid",
};

const eventSlice = createSlice({
  name: "events",
  initialState,
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },
    setViewMode: (state, action) => {
      state.viewMode = action.payload;
    },
    clearFilters: (state) => {
      state.searchQuery = "";
      state.selectedCategory = "All Events";
    },
  },
});

export const {
  setSearchQuery,
  setSelectedCategory,
  setViewMode,
  clearFilters,
} = eventSlice.actions;
export default eventSlice.reducer;
