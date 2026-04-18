import React from "react";
import { NotificationList } from "../../components/notifications/NotificationList";
import { Bell, Settings } from "lucide-react";
import { Link } from "react-router-dom";

const NotificationsPage = () => {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white flex items-center gap-3">
            <Bell className="w-8 h-8 text-primary-500" />
            Notification Center
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Stay updated with your campus life, events, and club activities.
          </p>
        </div>
        <Link
          to="/settings/notifications"
          className="flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-gray-800 hover:bg-gray-700 text-gray-900 dark:text-white rounded-lg transition-colors border border-gray-700"
        >
          <Settings className="w-4 h-4" />
          <span>Preferences</span>
        </Link>
      </div>

      <NotificationList />
    </div>
  );
};

export default NotificationsPage;
