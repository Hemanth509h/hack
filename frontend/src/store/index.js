import { configureStore } from '@reduxjs/toolkit';
import { api } from '../services/api';
import authReducer from '../features/auth/authSlice';
import eventReducer from '../features/events/eventSlice';
import clubReducer from '../features/clubs/clubSlice';
import teamReducer from '../features/teams/teamSlice';
import dashboardReducer from '../features/dashboard/dashboardSlice';
import mapReducer from '../features/map/mapSlice';
import notificationReducer from '../features/notifications/notificationSlice';
import profileReducer from '../features/profile/profileSlice';
import adminReducer from '../features/admin/adminSlice';
import chatReducer from '../features/chat/chatSlice';

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    auth: authReducer,
    events: eventReducer,
    clubs: clubReducer,
    teams: teamReducer,
    dashboard: dashboardReducer,
    map: mapReducer,
    notifications: notificationReducer,
    profile: profileReducer,
    admin: adminReducer,
    chat: chatReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

export 
export 
