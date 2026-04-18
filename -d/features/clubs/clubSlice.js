import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  filters: {
    search: "",
    category: "",
    sortBy: "active",
    page: 1,
    limit: 12,
  },
  selectedClubId: null,
  isCreationModalOpen: false,
};

const clubSlice = createSlice({
  name: "clubs",
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },
    setSelectedClubId: (state, action) => {
      state.selectedClubId = action.payload;
    },
    setCreationModalOpen: (state, action) => {
      state.isCreationModalOpen = action.payload;
    },
  },
});

export const {
  setFilters,
  resetFilters,
  setSelectedClubId,
  setCreationModalOpen,
} = clubSlice.actions;
export default clubSlice.reducer;
