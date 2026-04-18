import React, { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setInitializing, updateUser } from "../../features/auth/authSlice";
import { useGetMeQuery } from "../../features/auth/authApi";
import { Loader2 } from "lucide-react";

export const ProtectedRoute = () => {
  const { isAuthenticated, token, user, isInitializing } = useSelector(
    (state) => state.auth,
  );
  const location = useLocation();
  const dispatch = useDispatch();

  const {
    data: fetchedUser,
    isLoading,
    isError,
  } = useGetMeQuery(undefined, {
    skip: !token || !!user, // Skip if no token, or user is already loaded
  });

  useEffect(() => {
    if (fetchedUser) {
      dispatch(updateUser(fetchedUser));
      dispatch(setInitializing(false));
    } else if (isError || (!token && isInitializing)) {
      dispatch(setInitializing(false));
    }
  }, [fetchedUser, isError, token, isInitializing, dispatch]);

  if (isInitializing || isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-950">
        <Loader2 className="animate-spin text-blue-500 mb-4" size={48} />
        <p className="text-gray-600 dark:text-gray-400">
          Loading your profile...
        </p>
      </div>
    );
  }

  if (!isAuthenticated && !token) {
    // Redirect them to the /login page, but save the current location they were trying to go to
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export const RoleGuard = ({ allowedRoles }) => {
  const { isAuthenticated, user, isInitializing, token } = useSelector(
    (state) => state.auth,
  );
  const dispatch = useDispatch();

  const {
    data: fetchedUser,
    isLoading,
    isError,
  } = useGetMeQuery(undefined, {
    skip: !token || !!user,
  });

  useEffect(() => {
    if (fetchedUser) {
      dispatch(updateUser(fetchedUser));
      dispatch(setInitializing(false));
    } else if (isError || (!token && isInitializing)) {
      dispatch(setInitializing(false));
    }
  }, [fetchedUser, isError, token, isInitializing, dispatch]);

  if (isInitializing || isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-950">
        <Loader2 className="animate-spin text-blue-500 mb-4" size={48} />
      </div>
    );
  }

  if (!isAuthenticated && !token) {
    return <Navigate to="/login" replace />;
  }

  // If user is not yet populated but we're not initializing/loading, they shouldn't be here
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Handle generic JWT state where 'user' details haven't fully populated yet
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};
