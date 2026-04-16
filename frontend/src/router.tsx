import { createBrowserRouter, redirect } from 'react-router-dom';
import App from './App';
import DiscoverPage from './pages/DiscoverPage';
import { ProtectedRoute, RoleGuard } from './components/auth/ProtectedRoute';

// Empty placeholder components for unimplemented routes
const Placeholder = ({ title }: { title: string }) => (
  <div className="flex items-center justify-center min-h-[50vh]">
    <h2 className="text-2xl font-bold text-gray-500">{title} Area Under Construction 🚧</h2>
  </div>
);

import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import OAuthCallbackPage from './pages/auth/OAuthCallbackPage';

import EventsPage from './pages/events/EventsPage';
import EventDetailPage from './pages/events/EventDetailPage';
import CreateEventPage from './pages/events/CreateEventPage';
import MyEventsPage from './pages/events/MyEventsPage';

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
        loader: () => redirect('/discover'),
      },
      // Protected Routes for all authenticated students
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: 'discover',
            element: <DiscoverPage />,
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
            element: <Placeholder title="Clubs" />,
          },
          {
            path: 'teams',
            element: <Placeholder title="Team Projects" />,
          },
          {
            path: 'profile',
            element: <Placeholder title="User Profile" />,
          },
        ]
      },
      // Role-specific protected routes
      {
        element: <RoleGuard allowedRoles={['admin']} />,
        children: [
          {
            path: 'admin',
            element: <Placeholder title="Admin Dashboard" />,
          }
        ]
      }
    ],
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
