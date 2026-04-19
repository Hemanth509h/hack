import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, ExternalLink, Zap, Star, Code, Brain, CheckCircle } from 'lucide-react';
import { useRequestToJoinMutation, useBrowseProjectsQuery } from '../../services/teamApi';





const avatarColors = ['from-violet-500 to-indigo-600', 'from-pink-500 to-rose-600', 'from-emerald-500 to-teal-600'];

export const MatchDetailModal = ({ match, onClose }) => {
  const [message, setMessage] = useState('');
  const [selectedProject, setSelectedProject] = useState('');
  const [sent, setSent] = useState(false);

  const { data: projectsData } = useBrowseProjectsQuery({});
  const [requestToJoin, { isLoading }] = useRequestToJoinMutation();

  const handleSend = async () => {
    if (!selectedProject) return;
    try {
      await requestToJoin({ projectId: selectedProject, message }).unwrap();
      setSent(true);
    } catch {}
  };

  if (!match) return null;

  const pct = Math.round(match.matchScore * 100);
  const initials = match.user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 24 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="bg-white dark:bg-gray-900/95 border border-black/10 dark:border-white/10 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="relative p-8 pb-0">
            <button
              onClick={onClose}
              className="absolute top-6 right-6 w-9 h-9 flex items-center justify-center rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-gray-700 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:text-white transition-all"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-start gap-5 mb-6">
              <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${avatarColors[0]} flex items-center justify-center text-gray-900 dark:text-white font-bold text-2xl shrink-0 shadow-xl`}>
                {match.user.avatar
                  ? <img src={match.user.avatar} alt={match.user.name} className="w-full h-full object-cover rounded-2xl" />
                  : initials
              </div>
              <div>
                <h2 className="text-2xl font-black text-gray-900 dark:text-white">{match.user.name}</h2>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  {match.user.major || 'Computer Science'}
                  {match.user.graduationYear && ` · Class of ${match.user.graduationYear}`}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-emerald-500 to-teal-400 text-gray-900 dark:text-white text-xs font-black px-3 py-1 rounded-lg">
                    <Star className="w-3 h-3" /> {pct}% Match
                  </span>
                  {match.breakdown.isAvailable && (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-400/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                      <Zap className="w-3 h-3" /> Open to Team
                    </span>
                  )}
                </div>
              </div>
            </div>

            {match.user.bio && (
              <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-6 bg-white/3 rounded-xl p-4 border border-black/5 dark:border-white/5">
                {match.user.bio}
              </p>
            )}
          </div>

          <div className="p-8 pt-4 space-y-6">
            {/* Match Breakdown */}
            <div className="bg-white/3 rounded-2xl p-5 border border-black/5 dark:border-white/5">
              <h3 className="text-gray-900 dark:text-white font-bold text-sm mb-4 flex items-center gap-2">
                <Brain className="w-4 h-4 text-violet-400" /> AI Match Breakdown
              </h3>
              <div className="space-y-3">
                {[
                  { label: 'Skill Overlap', value: match.breakdown.skillOverlap, color: 'from-indigo-500 to-violet-500' },
                  { label: 'Interest Alignment', value: match.breakdown.interestAlignment, color: 'from-pink-500 to-rose-500' },
                  { label: 'Collaboration History', value: match.breakdown.collaborationHistory, color: 'from-amber-500 to-orange-500' },
                ].map(item => (
                  <div key={item.label}>
                    <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1.5">
                      <span>{item.label}</span>
                      <span className="font-bold text-gray-900 dark:text-white">{item.value}%</span>
                    </div>
                    <div className="h-2 bg-gray-50 dark:bg-gray-800 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${item.value}%` }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                        className={`h-full bg-gradient-to-r ${item.color} rounded-full`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Skills */}
            {match.user.skills.length > 0 && (
              <div>
                <h3 className="text-gray-900 dark:text-white font-bold text-sm mb-3 flex items-center gap-2">
                  <Code className="w-4 h-4 text-indigo-400" /> Skills & Expertise
                </h3>
                <div className="flex flex-wrap gap-2">
                  {match.user.skills.map((skill) => (
                    <span
                      key={skill._id}
                      className="text-xs font-semibold text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1.5 rounded-lg"
                    >
                      {skill.name}
                      {skill.category && <span className="text-indigo-500 ml-1.5">· {skill.category}</span>}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Common Interests */}
            {match.user.interests.length > 0 && (
              <div>
                <h3 className="text-gray-900 dark:text-white font-bold text-sm mb-3 flex items-center gap-2">
                  <Star className="w-4 h-4 text-amber-400" /> Interests
                </h3>
                <div className="flex flex-wrap gap-2">
                  {match.user.interests.map((interest, i) => (
                    <span key={i} className="text-xs font-semibold text-amber-300 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-lg">
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Send Request */}
            {!sent ? (
              <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-2xl p-5">
                <h3 className="text-gray-900 dark:text-white font-bold text-sm mb-4 flex items-center gap-2">
                  <Send className="w-4 h-4 text-indigo-400" /> Invite to Your Project
                </h3>
                <select
                  value={selectedProject}
                  onChange={e => setSelectedProject(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white mb-3 focus:outline-none focus:border-indigo-500 transition-colors"
                >
                  <option value="">Select your project…</option>
                  {projectsData?.projects.map(p => (
                    <option key={p._id} value={p._id}>{p.title}</option>
                  ))}
                </select>
                <textarea
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="Add an optional message… (e.g. 'Your React skills would be perfect for our dashboard feature')"
                  rows={3}
                  className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white placeholder-gray-500 resize-none focus:outline-none focus:border-indigo-500 transition-colors mb-3"
                />
                <button
                  onClick={handleSend}
                  disabled={isLoading || !selectedProject}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:opacity-40 disabled:cursor-not-allowed text-gray-900 dark:text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-500/20"
                >
                  <Send className="w-4 h-4" />
                  {isLoading ? 'Sending…' : 'Send Request'}
                </button>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center py-8 text-center"
              >
                <CheckCircle className="w-14 h-14 text-emerald-400 mb-3" />
                <h3 className="text-gray-900 dark:text-white font-bold text-lg">Request Sent</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">Your team invite has been delivered to {match.user.name}.</p>
              </motion.div>
            )}

            <div className="text-center">
              <button className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-indigo-400 transition-colors">
                <ExternalLink className="w-3 h-3" /> View Full Profile
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
