import { createSlice, PayloadAction } from '@reduxjs/toolkit';

;
  searchQuery;
  activeTab: 'leading' | 'joined' | 'requests';
  selectedProjectId: string | null;
}

const initialState = {
  filters: {
    skills: [],
    event: null,
  },
  searchQuery: '',
  activeTab: 'leading',
  selectedProjectId: null,
};

const teamSlice = createSlice({
  name: 'teams',
  initialState,
  reducers: {
    addSkillFilter: (state, action) => {
      if (!state.filters.skills.includes(action.payload)) {
        state.filters.skills.push(action.payload);
      }
    },
    removeSkillFilter: (state, action) => {
      state.filters.skills = state.filters.skills.filter(s => s !== action.payload);
    },
    setEventFilter: (state, action) => {
      state.filters.event = action.payload;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
    setSelectedProjectId: (state, action) => {
      state.selectedProjectId = action.payload;
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
      state.searchQuery = initialState.searchQuery;
    },
  },
});

export const {
  addSkillFilter,
  removeSkillFilter,
  setEventFilter,
  setSearchQuery,
  setActiveTab,
  setSelectedProjectId,
  clearFilters,
} = teamSlice.actions;
export default teamSlice.reducer;
