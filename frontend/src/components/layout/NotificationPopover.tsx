import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Check, Trash2, X, Info, Calendar, Users } from 'lucide-react';
import { useGetNotificationsQuery, useMarkAsReadMutation, useDeleteNotificationMutation } from '../../services/notificationApi';

interface NotificationPopoverProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationPopover: React.FC<NotificationPopoverProps> = ({ isOpen, onClose }) => {
  const { data, isLoading } = useGetNotificationsQuery();
  const [markAsRead] = useMarkAsReadMutation();
  const [deleteNotification] = useDeleteNotificationMutation();

  const notifications = data?.notifications || [];
  const unreadCount = data?.unreadCount || 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-[60]" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10, x: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="fixed top-24 right-6 md:right-12 w-full max-w-md glass rounded-[2.5rem] shadow-[0_30px_60px_rgba(0,0,0,0.5)] border-black/10 dark:border-white/10 z-[70] overflow-hidden flex flex-col max-h-[70vh]"
          >
            <div className="p-8 border-b border-black/5 dark:border-white/5 flex items-center justify-between bg-white/2">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400">
                  <Bell size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-display font-black text-gray-900 dark:text-white tracking-tighter">Signal Center</h3>
                  <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">{unreadCount} Unread Alerts</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-xl text-gray-500 transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="overflow-y-auto custom-scrollbar flex-1">
              {isLoading ? (
                <div className="py-20 flex justify-center">
                  <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : notifications?.length === 0 ? (
                <div className="py-20 text-center">
                  <Bell className="mx-auto mb-4 text-gray-800" size={48} />
                  <p className="text-gray-500 font-black uppercase tracking-widest text-xs">All frequencies clear</p>
                </div>
              ) : (
                <div className="divide-y divide-white/5">
                  {notifications.map((notification) => (
                    <div 
                      key={notification._id}
                      className={`p-6 hover:bg-black/5 dark:hover:bg-white/5 transition-colors group relative ${!notification.isRead ? 'bg-indigo-500/5' : ''}`}
                    >
                      <div className="flex gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                          notification.type === 'event' ? 'bg-blue-500/10 text-blue-400' :
                          notification.type === 'club' ? 'bg-purple-500/10 text-purple-400' :
                          'bg-indigo-500/10 text-indigo-400'
                        }`}>
                          {notification.type === 'event' ? <Calendar size={18} /> : 
                           notification.type === 'club' ? <Users size={18} /> : 
                           <Info size={18} />}
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-1">{notification.title}</h4>
                          <p className="text-xs text-gray-500 leading-relaxed mb-2">{notification.message}</p>
                          <span className="text-[8px] font-black text-gray-600 uppercase tracking-widest">
                            {new Date(notification.createdAt).toLocaleTimeString()}
                          </span>
                        </div>
                        <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          {!notification.isRead && (
                            <button 
                              onClick={() => markAsRead(notification._id)}
                              className="p-2 hover:bg-green-500/10 text-gray-500 hover:text-green-500 rounded-lg transition-colors"
                              title="Mark as read"
                            >
                              <Check size={14} />
                            </button>
                          )}
                          <button 
                            onClick={() => deleteNotification(notification._id)}
                            className="p-2 hover:bg-red-500/10 text-gray-500 hover:text-red-500 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-6 bg-white/2 border-t border-black/5 dark:border-white/5 flex justify-center">
              <button className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em] hover:text-indigo-400 transition-colors">
                View All Archives
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default NotificationPopover;
