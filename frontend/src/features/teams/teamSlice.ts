import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TeamState {
  filters: {
    skills: string[];
    event: string | null;
  };
  searchQuery: string;
  activeTab: 'leading' | 'joined' | 'requests';
  selectedProjectId: string | null;
}

const initialState: TeamState = {
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
    addSkillFilter: (state, action: PayloadAction<string>) => {
      if (!state.filters.skills.includes(action.payload)) {
        state.filters.skills.push(action.payload);
      }
    },
    removeSkillFilter: (state, action: PayloadAction<string>) => {
      state.filters.skills = state.filters.skills.filter(s => s !== action.payload);
    },
    setEventFilter: (state, action: PayloadAction<string | null>) => {
      state.filters.event = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setActiveTab: (state, action: PayloadAction<'leading' | 'joined' | 'requests'>) => {
      state.activeTab = action.payload;
    },
    setSelectedProjectId: (state, action: PayloadAction<string | null>) => {
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
