import { createBrowserRouter, redirect } from 'react-router-dom';
import App from './App';
import DashboardPage from './pages/dashboard/DashboardPage';
import { ProtectedRoute, RoleGuard } from './components/auth/ProtectedRoute';


// Empty placeholder components for unimplemented routes
const Placeholder = ({ title }: { title: string }) => (
  <div className="flex items-center justify-center min-h-[50vh]">
    <h2 className="text-2xl font-bold text-gray-500">{title} Area Under Construction 🚧</h2>
  </div>
);

import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import UserManagementPage from './pages/admin/UserManagementPage';
import ClubApprovalPage from './pages/admin/ClubApprovalPage';
import AnalyticsPage from './pages/admin/AnalyticsPage';
import SystemManagementPage from './pages/admin/SystemManagementPage';

import NetworkPage from './pages/network/NetworkPage';
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

// Notifications
import NotificationsPage from './pages/notifications/NotificationsPage';
import NotificationPreferences from './pages/notifications/NotificationPreferences';

// Profile
import ProfilePage from './pages/profile/ProfilePage';
import EditProfilePage from './pages/profile/EditProfilePage';
import PortfolioBuilderPage from './pages/profile/PortfolioBuilderPage';
export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
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
    element: <App />, // App contains the Navbar and Global layouts
    children: [
      {
        index: true,
        loader: () => redirect('/dashboard'),
      },
      // Protected Routes for all authenticated students
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: 'dashboard',
            element: <DashboardPage />,
          },
          {
            path: 'map',
            element: <MapPage />,
          },
          {
            path: 'search',
            element: <SearchPage />,
          },
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
          {
            path: 'teams',
            element: <Placeholder title="Team Projects" />,
          },
          {
            path: 'notifications',
            element: <NotificationsPage />,
          },
          {
            path: 'settings/notifications',
            element: <NotificationPreferences />,
          },
          {
            path: 'profile',
            children: [
              { index: true, element: <ProfilePage /> }, // fallback to self if available
              { path: ':userId', element: <ProfilePage /> },
              { path: 'edit', element: <EditProfilePage /> },
            ]
          },
        ]
      }
    ],
  },
  // Role-specific protected routes OUTSIDE the main App layout to avoid Navbar overlap
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
          { path: 'analytics', element: <AnalyticsPage /> },
          { path: 'system', element: <SystemManagementPage /> }
        ]
      }
    ]
  },
  {
    path: '/unauthorized',
    element: (
      <div className="flex items-center justify-center min-h-screen bg-gray-950 text-red-500">
        <h1 className="text-4xl font-bold">403: Unauthorized Access</h1>
      </div>
    )
  }
]);
