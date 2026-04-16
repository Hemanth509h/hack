import { configureStore } from '@reduxjs/toolkit';
import { api } from '../services/api';
import authReducer from '../features/auth/authSlice';
import eventReducer from '../features/events/eventSlice';
import clubReducer from '../features/clubs/clubSlice';
import teamReducer from '../features/teams/teamSlice';

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    auth: authReducer,
    events: eventReducer,
    clubs: clubReducer,
    teams: teamReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
