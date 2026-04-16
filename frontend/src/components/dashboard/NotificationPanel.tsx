import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bell, Info, Calendar, Users, Briefcase } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setNotificationPanelOpen } from '../../features/dashboard/dashboardSlice';
import { Link } from 'react-router-dom';

const mockNotifications = [
  { id: 1, type: 'event', title: 'Hackathon starts in 1 hour!', time: '1h ago', icon: Calendar, color: 'text-indigo-400 bg-indigo-400/10', link: '/events' },
  { id: 2, type: 'team', title: 'Alex requested to join your project', time: '3h ago', icon: Users, color: 'text-amber-400 bg-amber-400/10', link: '/teams/my-projects' },
  { id: 3, type: 'club', title: 'New announcement from CS Club', time: '1d ago', icon: Briefcase, color: 'text-emerald-400 bg-emerald-400/10', link: '/clubs/my-clubs' },
];

export const NotificationPanel: React.FC = () => {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((state) => state.dashboard.isNotificationPanelOpen);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => dispatch(setNotificationPanelOpen(false))}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-sm bg-gray-900 border-l border-white/10 z-50 shadow-2xl flex flex-col"
          >
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <h2 className="text-xl font-bold flex items-center gap-2 text-white">
                <Bell className="w-5 h-5 text-indigo-400" /> Notifications
              </h2>
              <button
                onClick={() => dispatch(setNotificationPanelOpen(false))}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {mockNotifications.map((notif) => {
                const Icon = notif.icon;
                return (
                  <Link
                    key={notif.id}
                    to={notif.link}
                    onClick={() => dispatch(setNotificationPanelOpen(false))}
                    className="group flex gap-4 p-4 rounded-xl bg-gray-800/50 border border-gray-700/50 hover:bg-gray-800 transition-all hover:border-indigo-500/30"
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${notif.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-200 group-hover:text-indigo-300 transition-colors">
                        {notif.title}
                      </p>
                      <span className="text-xs text-gray-500 mt-1 block">{notif.time}</span>
                    </div>
                  </Link>
                );
              })}
            </div>

            <div className="p-4 border-t border-white/10">
              <button className="w-full py-3 text-sm font-semibold text-gray-400 hover:text-white transition-colors">
                Clear All
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
