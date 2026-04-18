import React, { useEffect } from "react";
import { Bell } from "lucide-react";
import { Link } from "react-router-dom";
import { useGetNotificationsQuery } from "../../services/notificationApi";
import { useDispatch, useSelector } from "react-redux";
import { setUnreadCount } from "../../features/notifications/notificationSlice";

export const NotificationBadge = () => {
  const { data } = useGetNotificationsQuery();
  const dispatch = useDispatch();
  const unreadCount = useSelector((state) => state.notifications.unreadCount);

  useEffect(() => {
    if (data?.unreadCount !== undefined) {
      dispatch(setUnreadCount(data.unreadCount));
    }
  }, [data, dispatch]);

  return (
    <Link
      to="/notifications"
      className="relative p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:text-white transition-colors rounded-full hover:bg-gray-800"
    >
      <Bell className="w-6 h-6" />
      {unreadCount > 0 && (
        <span className="absolute top-1 right-1 flex items-center justify-center w-5 h-5 text-xs font-bold text-gray-900 dark:text-white bg-red-500 rounded-full border-2 border-gray-950">
          {unreadCount > 99 ? "99+" : unreadCount}
        </span>
      )}
    </Link>
  );
};
