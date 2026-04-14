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

const LoginDummy = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-gray-950 text-white">
    <h1 className="text-3xl font-bold mb-4">Login to The Quad</h1>
    <button 
      onClick={() => {
        localStorage.setItem('token', 'dummy-token');
        window.location.href = '/discover';
      }}
      className="px-6 py-2 bg-blue-600 rounded-lg hover:bg-blue-700"
    >
      Simulate Login
    </button>
  </div>
);

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginDummy />,
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
            element: <Placeholder title="Events" />,
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
