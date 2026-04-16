import React from 'react';
import { INotification } from '../../types/notification';
import { useMarkAsReadMutation } from '../../services/notificationApi';
import { Bell, Calendar, Info, Users } from 'lucide-react';
import cn from 'clsx';

interface NotificationItemProps {
  notification: INotification;
}

export const NotificationItem: React.FC<NotificationItemProps> = ({ notification }) => {
  const [markAsRead] = useMarkAsReadMutation();

  const handleRead = () => {
    if (!notification.isRead) {
      markAsRead(notification._id);
    }
  };

  const getIcon = () => {
    switch (notification.type) {
      case 'event_update': return <Calendar className="w-5 h-5 text-blue-400" />;
      case 'team_request': return <Users className="w-5 h-5 text-green-400" />;
      case 'club_announcement': return <Bell className="w-5 h-5 text-purple-400" />;
      default: return <Info className="w-5 h-5 text-gray-400" />;
    }
  };

  return (
    <div
      onClick={handleRead}
      className={cn(
        "flex p-4 border-b border-gray-800 hover:bg-gray-800/50 cursor-pointer transition-colors",
        !notification.isRead ? "bg-gray-800/30" : "bg-transparent"
      )}
    >
      <div className="flex-shrink-0 mt-1">
        <div className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center border border-gray-700 shadow-inner">
          {getIcon()}
        </div>
      </div>
      <div className="ml-4 flex-1">
        <div className="flex items-start justify-between">
          <p className={cn("text-sm", !notification.isRead ? "text-white font-semibold" : "text-gray-300 font-medium")}>
            {notification.title}
          </p>
          <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
            {new Date(notification.createdAt).toLocaleDateString()}
          </span>
        </div>
        <p className={cn("text-sm mt-1", !notification.isRead ? "text-gray-300" : "text-gray-400")}>
          {notification.message}
        </p>
        {!notification.isRead && (
          <div className="mt-2 text-xs text-primary-400 font-medium tracking-wide flex items-center">
            <span className="w-1.5 h-1.5 rounded-full bg-primary-500 mr-2 animate-pulse"></span>
            Unread
          </div>
        )}
      </div>
    </div>
  );
};
