import { createBrowserRouter, redirect } from 'react-router-dom';
import App from './App';
import DashboardPage from './pages/dashboard/DashboardPage';
import { ProtectedRoute, RoleGuard } from './components/auth/ProtectedRoute';

import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import UserManagementPage from './pages/admin/UserManagementPage';
import ClubApprovalPage from './pages/admin/ClubApprovalPage';
import AnalyticsPage from './pages/admin/AnalyticsPage';
import SystemManagementPage from './pages/admin/SystemManagementPage';
import BroadcastPage from './pages/admin/BroadcastPage';
import EventManagementPage from './pages/admin/EventManagementPage';

import SearchPage from './pages/search/SearchPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import OAuthCallbackPage from './pages/auth/OAuthCallbackPage';

import EventsPage from './pages/events/EventsPage';
import EventDetailPage from './pages/events/EventDetailPage';
import CreateEventPage from './pages/events/CreateEventPage';
import MyEventsPage from './pages/events/MyEventsPage';

import ClubsPage from './pages/clubs/ClubsPage';
import ClubDetailPage from './pages/clubs/ClubDetailPage';
import ClubDashboardPage from './pages/clubs/ClubDashboardPage';
import CreateClubPage from './pages/clubs/CreateClubPage';
import MyClubsPage from './pages/clubs/MyClubsPage';
import MapPage from './pages/map/MapPage';

import NotificationsPage from './pages/notifications/NotificationsPage';
import NotificationPreferences from './pages/notifications/NotificationPreferences';

import ProfilePage from './pages/profile/ProfilePage';
import EditProfilePage from './pages/profile/EditProfilePage';
import DiscoverPage from './pages/DiscoverPage';
import TeamsPage from './pages/teams/TeamsPage';
import SettingsPage from './pages/settings/SettingsPage';
import ChatPage from './pages/chat/ChatPage';
import PrivacySettingsPage from './pages/settings/PrivacySettingsPage';
import SecuritySettingsPage from './pages/settings/SecuritySettingsPage';
import PulsePage from './pages/PulsePage';
import RootErrorPage from './components/RootErrorPage';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
    errorElement: <RootErrorPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
    errorElement: <RootErrorPage />,
  },
  {
    path: '/forgot-password',
    element: <ForgotPasswordPage />,
  },
  {
    path: '/reset-password',
    element: <ResetPasswordPage />,
  },
  {
    path: '/oauth-callback',
    element: <OAuthCallbackPage />,
  },
  {
    path: '/',
    element: <App />,
    errorElement: <RootErrorPage />,
    children: [
      {
        index: true,
        loader: () => redirect('/discover'),
      },
      {
        element: <ProtectedRoute />,
        children: [
          { path: 'discover', element: <DiscoverPage /> },
          { path: 'dashboard', element: <DashboardPage /> },
          { path: 'map', element: <MapPage /> },
          { path: 'search', element: <SearchPage /> },
          { path: 'feed', element: <PulsePage /> },
          {
            path: 'events',
            children: [
              { index: true, element: <EventsPage /> },
              { path: 'my-rsvps', element: <MyEventsPage /> },
              { path: 'create', element: <CreateEventPage /> },
              { path: ':id', element: <EventDetailPage /> }
            ]
          },
          {
            path: 'clubs',
            children: [
              { index: true, element: <ClubsPage /> },
              { path: 'my-clubs', element: <MyClubsPage /> },
              { path: 'create', element: <CreateClubPage /> },
              { path: ':id', element: <ClubDetailPage /> },
              { path: ':id/dashboard', element: <ClubDashboardPage /> },
            ]
          },
          { path: 'teams', element: <TeamsPage /> },
          { path: 'notifications', element: <NotificationsPage /> },
          {
            path: 'settings',
            children: [
              { index: true, element: <SettingsPage /> },
              { path: 'notifications', element: <NotificationPreferences /> },
              { path: 'privacy', element: <PrivacySettingsPage /> },
              { path: 'security', element: <SecuritySettingsPage /> },
            ]
          },
          { path: 'chat', element: <ChatPage /> },
          {
            path: 'profile',
            children: [
              { index: true, element: <ProfilePage /> },
              { path: ':userId', element: <ProfilePage /> },
              { path: 'edit', element: <EditProfilePage /> },
            ]
          },
        ]
      },
    ],
  },
  {
    element: <RoleGuard allowedRoles={['admin']} />,
    children: [
      {
        path: '/admin',
        element: <AdminLayout />,
        children: [
          { index: true, element: <AdminDashboardPage /> },
          { path: 'users', element: <UserManagementPage /> },
          { path: 'clubs/pending', element: <ClubApprovalPage /> },
          { path: 'events', element: <EventManagementPage /> },
          { path: 'broadcast', element: <BroadcastPage /> },
          { path: 'analytics', element: <AnalyticsPage /> },
          { path: 'system', element: <SystemManagementPage /> }
        ]
      }
    ]
  },
  {
    path: '/unauthorized',
    element: (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-950 text-red-500">
        <h1 className="text-4xl font-bold">403: Unauthorized Access</h1>
      </div>
    )
  }
], {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true,
    v7_fetcherPersist: true,
    v7_normalizeFormMethod: true,
    v7_partialHydration: true,
    v7_skipActionErrorRevalidation: true,
  }
});
console.log('[router]: Router initialized with future flags');
