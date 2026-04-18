import React from 'react';
import { useGetEventAttendeesQuery, useApproveRSVPMutation, useRejectRSVPMutation } from '../../services/eventApi';
import { Loader2, Check, X, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';



export const RSVPManagement: React.FC = ({ eventId }) => {
  const { data, isLoading, error } = useGetEventAttendeesQuery(eventId);
  const [approveRSVP] = useApproveRSVPMutation();
  const [rejectRSVP] = useRejectRSVPMutation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
      </div>
    );
  }

  if (error || !data) {
    return <div className="text-center py-8 text-gray-500">Failed to load RSVP registry.</div>;
  }

  const attendees = data.attendees;

  if (attendees.length === 0) {
    return (
      <div className="text-center py-12 glass bg-black/5 dark:bg-white/5 rounded-3xl border-dashed border-black/10 dark:border-white/10">
        <UserIcon className="w-12 h-12 text-gray-700 mx-auto mb-4" />
        <p className="text-gray-500 font-medium">No active or pending RSVPs yet.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-separate border-spacing-y-4">
        <thead>
          <tr className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
            <th className="px-6 pb-2">Student</th>
            <th className="px-6 pb-2">Context</th>
            <th className="px-6 pb-2">Status</th>
            <th className="px-6 pb-2 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          <AnimatePresence mode="popLayout">
            {attendees.map((rsvp) => (
              <motion.tr
                key={rsvp._id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="group"
              >
                <td className="px-6 py-4 glass bg-black/5 dark:bg-white/5 rounded-l-2xl border-l border-t border-b border-black/5 dark:border-white/5">
                  <div className="flex items-center gap-4">
                    <img
                      src={rsvp.user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(rsvp.user?.name || 'User')}&background=random`}
                      alt={rsvp.user?.name}
                      className="w-10 h-10 rounded-full object-cover border-2 border-black/10 dark:border-white/10"
                    />
                    <div>
                      <div className="text-gray-900 dark:text-white font-bold tracking-tight text-sm">{rsvp.user?.name}</div>
                      <div className="text-[10px] text-gray-500 font-medium uppercase tracking-widest">{rsvp.user?.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 glass bg-black/5 dark:bg-white/5 border-t border-b border-black/5 dark:border-white/5">
                  <div className="text-gray-600 dark:text-gray-400 text-xs font-medium">
                    {rsvp.user?.major || 'General'}
                    <span className="block text-[10px] text-gray-600 mt-1 uppercase">Class of {rsvp.user?.graduationYear || 'N/A'}</span>
                  </div>
                </td>
                <td className="px-6 py-4 glass bg-black/5 dark:bg-white/5 border-t border-b border-black/5 dark:border-white/5">
                  <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                    rsvp.status === 'attending' 
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  }`}>
                    {rsvp.status}
                  </span>
                </td>
                <td className="px-6 py-4 glass bg-black/5 dark:bg-white/5 rounded-r-2xl border-r border-t border-b border-black/5 dark:border-white/5 text-right">
                  {rsvp.status === 'pending' && (
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => approveRSVP({ eventId, userId: rsvp.user?._id })}
                        className="p-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-lg transition-colors"
                        title="Approve RSVP"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => rejectRSVP({ eventId, userId: rsvp.user?._id })}
                        className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
                        title="Reject RSVP"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  {rsvp.status === 'attending' && (
                    <button
                      onClick={() => rejectRSVP({ eventId, userId: rsvp.user?._id })}
                      className="p-2 opacity-0 group-hover:opacity-100 hover:bg-red-500/10 text-red-400/40 hover:text-red-400 rounded-lg transition-all"
                      title="Revoke RSVP"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </td>
              </motion.tr>
            ))}
          </AnimatePresence>
        </tbody>
      </table>
    </div>
  );
};
