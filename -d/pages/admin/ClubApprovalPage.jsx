import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Users,
  X,
  Check,
  MessageSquare,
  ShieldCheck,
  PlusCircle,
} from "lucide-react";
import { Link } from "react-router-dom";

import {
  useGetPendingClubsQuery,
  useResolveClubApplicationMutation,
} from "../../features/admin/adminApi";

const ClubApprovalPage = () => {
  const [selectedApp, setSelectedApp] = useState(null);
  const [rejectReason, setRejectReason] = useState("");

  const { data: pendingClubs = [], isLoading } = useGetPendingClubsQuery();
  const [resolveClubApplication] = useResolveClubApplicationMutation();

  const handleApprove = async (id) => {
    try {
      await resolveClubApplication({ clubId: id, status: "approve" }).unwrap();
    } catch (err) {
      console.error("Failed to approve club", err);
    }
  };

  const handleReject = async (id) => {
    try {
      await resolveClubApplication({
        clubId: id,
        status: "reject",
        reason: rejectReason,
      }).unwrap();
      setSelectedApp(null);
      setRejectReason("");
    } catch (err) {
      console.error("Failed to reject club", err);
    }
  };

  return (
    <div className="space-y-10 py-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-block px-4 py-1.5 mb-4 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-black uppercase tracking-[0.2em]"
          >
            Administrative Portal
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-display font-black mb-3 tracking-tighter text-gray-900 dark:text-white">
            Clubs Management
          </h1>
          <p className="text-gray-500 font-medium text-lg">
            Initialize new organizations or moderate the pending queue.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Link
            to="/clubs/create"
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-gray-900 dark:text-white rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-2 shadow-[0_0_20px_rgba(79,70,229,0.3)] transition-all"
          >
            <PlusCircle size={18} /> Add New Club
          </Link>
          <div className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl px-6 py-3 flex items-center gap-4">
            <div className="text-right">
              <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                Queue Status
              </div>
              <div className="text-gray-900 dark:text-white font-black text-xl">
                {pendingClubs.length} Pending
              </div>
            </div>
            <div className="w-1.5 h-10 bg-indigo-500 rounded-full" />
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-6">
          <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
          <p className="text-gray-500 font-bold uppercase tracking-widest text-sm">
            Syncing applications...
          </p>
        </div>
      ) : pendingClubs.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-[3rem] p-24 text-center shadow-2xl border-black/5 dark:border-white/5"
        >
          <div className="w-24 h-24 bg-indigo-500/10 text-indigo-400 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
            <ShieldCheck size={40} />
          </div>
          <h3 className="text-3xl font-display font-black text-gray-900 dark:text-white mb-4 tracking-tighter">
            Excellence Maintained
          </h3>
          <p className="text-gray-500 text-lg font-light">
            All organization applications have been reviewed. The campus is in
            harmony.
          </p>
        </motion.div>
      ) : (
        <div className="grid gap-10 md:grid-cols-2">
          {pendingClubs.map((app, index) => (
            <motion.div
              key={app.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass rounded-[2.5rem] p-10 shadow-[0_20px_50px_rgba(0,0,0,0.3)] relative overflow-hidden flex flex-col transition-all duration-500 border-black/5 dark:border-white/5 hover:border-indigo-500/30 group"
            >
              {/* Decorative Gradient */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-3xl -mr-16 -mt-16 group-hover:bg-indigo-500/10 transition-colors" />

              {/* Badge */}
              <div className="absolute top-10 right-10">
                <span className="px-4 py-1.5 bg-indigo-500/10 text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em] rounded-full border border-indigo-500/20">
                  {app.category}
                </span>
              </div>

              <h3 className="text-3xl font-display font-black text-gray-900 dark:text-white mb-4 pr-24 tracking-tighter leading-tight">
                {app.name}
              </h3>
              <p className="text-gray-500 text-base mb-10 flex-1 leading-relaxed font-light">
                {app.description}
              </p>

              <div className="grid grid-cols-2 gap-6 mb-10">
                <div className="glass bg-black/5 dark:bg-white/5 rounded-2xl p-5 border-black/5 dark:border-white/5">
                  <div className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-2 flex items-center gap-2">
                    <Calendar size={14} className="text-indigo-500" />{" "}
                    Application Date
                  </div>
                  <div className="text-gray-900 dark:text-white text-lg font-black">
                    {new Date(app.applicationDate).toLocaleDateString()}
                  </div>
                </div>
                <div className="glass bg-black/5 dark:bg-white/5 rounded-2xl p-5 border-black/5 dark:border-white/5">
                  <div className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-2 flex items-center gap-2">
                    <Users size={14} className="text-indigo-500" /> Expected
                    Members
                  </div>
                  <div className="text-gray-900 dark:text-white text-lg font-black">
                    {app.expectedMembership} Elite
                  </div>
                </div>
              </div>

              <div className="mb-10">
                <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4 opacity-50">
                  Visionary Leaders
                </div>
                <div className="space-y-3">
                  {app.proposedLeaders.map((leader, i) => (
                    <div
                      key={i}
                      className="flex justify-between items-center glass bg-white/2 px-5 py-4 rounded-2xl border-black/5 dark:border-white/5 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                    >
                      <span className="text-base font-bold text-gray-900 dark:text-white tracking-tight">
                        {leader.name}
                      </span>
                      <span className="text-xs text-gray-500 font-medium">
                        {leader.email}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-5 mt-auto pt-10 border-t border-black/5 dark:border-white/5">
                <button
                  onClick={() => setSelectedApp(app.id)}
                  className="flex items-center justify-center gap-3 py-4 bg-black/5 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:text-red-400 hover:bg-red-400/5 rounded-2xl font-black uppercase tracking-widest text-[11px] transition-all duration-300 border border-black/5 dark:border-white/5 hover:border-red-500/20"
                >
                  <X size={18} /> Reject
                </button>
                <button
                  onClick={() => handleApprove(app.id)}
                  className="btn-primary py-4 px-0 shadow-indigo-500/20 flex items-center justify-center gap-3 text-[11px] font-black uppercase tracking-widest"
                >
                  <Check size={18} /> Approve
                </button>
              </div>

              {/* Premium Rejection Modal */}
              <AnimatePresence>
                {selectedApp === app.id && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="absolute inset-0 bg-gray-50 dark:bg-[#030303]/98 p-10 backdrop-blur-xl z-20 flex flex-col justify-center"
                  >
                    <h4 className="text-3xl font-display font-black text-red-400 mb-4 tracking-tighter flex items-center gap-4">
                      <MessageSquare size={32} /> Constructive Feedback
                    </h4>
                    <p className="text-gray-500 text-lg mb-8 font-light leading-relaxed">
                      Please provide clarity on why this application does not
                      currently meet our campus excellence standards.
                    </p>
                    <textarea
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      className="w-full h-40 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-3xl p-6 text-base text-gray-900 dark:text-white focus:border-red-500/50 focus:outline-none mb-8 resize-none transition-colors"
                      placeholder="Detail the necessary improvements..."
                    />

                    <div className="flex gap-4">
                      <button
                        onClick={() => setSelectedApp(null)}
                        className="flex-1 py-4 glass bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-gray-900 dark:text-white rounded-2xl font-black uppercase tracking-widest text-[11px] transition-all border-black/10 dark:border-white/10"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleReject(app.id)}
                        disabled={!rejectReason.trim()}
                        className="flex-1 py-4 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-gray-900 dark:text-white rounded-2xl font-black uppercase tracking-widest text-[11px] transition-all shadow-lg shadow-red-500/20"
                      >
                        Confirm Rejection
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ClubApprovalPage;
