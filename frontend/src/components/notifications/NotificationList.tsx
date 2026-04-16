import React, { useState } from 'react';
import { useGetNotificationsQuery, useMarkAllAsReadMutation } from '../../services/notificationApi';
import { NotificationItem } from './NotificationItem';
import { Check } from 'lucide-react';
import cn from 'clsx';

export const NotificationList: React.FC = () => {
  const { data, isLoading } = useGetNotificationsQuery();
  const [markAllAsRead] = useMarkAllAsReadMutation();
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'event_update' | 'club_announcement' | 'team_request' | 'system'>('all');

  const notifications = data?.notifications || [];

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread' && n.isRead) return false;
    if (typeFilter !== 'all' && n.type !== typeFilter) return false;
    return true;
  });

  return (
    <div className="flex flex-col bg-gray-900 border border-gray-800 rounded-xl overflow-hidden shadow-2xl">
      <div className="p-4 border-b border-gray-800 bg-gray-900/50 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Notifications</h2>
          <button
            onClick={() => markAllAsRead()}
            className="flex items-center text-sm text-gray-400 hover:text-white transition-colors"
          >
            <Check className="w-4 h-4 mr-1" />
            Mark all read
          </button>
        </div>

        <div className="flex flex-wrap gap-2 text-sm">
          {['all', 'event_update', 'club_announcement', 'team_request', 'system'].map(t => (
            <button
              key={t}
              onClick={() => setTypeFilter(t as any)}
              className={cn(
                "px-3 py-1 rounded-full border transition-all",
                typeFilter === t ? "bg-primary-500/20 border-primary-500 text-primary-400" : "bg-transparent border-gray-700 text-gray-400 hover:border-gray-600"
              )}
            >
              {t === 'all' ? 'All' : t.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </button>
          ))}
          <div className="flex-1" />
          <button
            onClick={() => setFilter(f => f === 'all' ? 'unread' : 'all')}
            className={cn(
               "px-3 py-1 rounded-full border transition-all text-sm",
               filter === 'unread' ? "bg-gray-700 border-gray-600 text-white" : "bg-transparent border-gray-700 text-gray-400"
            )}
          >
            Unread only
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto max-h-[600px] min-h-[400px]">
        {isLoading ? (
          <div className="p-8 text-center text-gray-500">Loading notifications...</div>
        ) : filteredNotifications.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-4">
               <Check className="w-8 h-8 text-gray-600" />
            </div>
            <p className="text-gray-400 font-medium">You're all caught up!</p>
            <p className="text-sm text-gray-500 mt-1">No new notifications here.</p>
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <NotificationItem key={notification._id} notification={notification} />
          ))
        )}
      </div>
    </div>
  );
};
