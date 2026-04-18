import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Users,
  Wrench,
  CalendarDays,
  Edit3,
  Eye,
  UserPlus,
  CheckCircle,
  Circle,
} from "lucide-react";

const statusConfig = {
  open: {
    label: "Open",
    color: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  },
  full: {
    label: "Full",
    color: "text-amber-400 bg-amber-400/10 border-amber-400/20",
  },
  completed: {
    label: "Completed",
    color: "text-gray-600 dark:text-gray-400 bg-gray-400/10 border-gray-400/20",
  },
};

const avatarColors = [
  "from-violet-500 to-indigo-600",
  "from-pink-500 to-rose-600",
  "from-emerald-500 to-teal-600",
  "from-amber-500 to-orange-600",
  "from-blue-500 to-cyan-600",
];

export const ProjectCard = ({ project, isLeader, index = 0 }) => {
  const status = statusConfig[project.status];
  const pendingCount = project.pendingRequests?.length || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      className="bg-white dark:bg-gray-900/70 backdrop-blur-xl border border-white/8 rounded-2xl p-6 hover:border-indigo-500/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/10 group"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3 gap-3">
        <h3 className="text-gray-900 dark:text-white font-bold text-base leading-tight group-hover:text-indigo-300 transition-colors">
          {project.title}
        </h3>
        <div className="flex items-center gap-2 shrink-0">
          {isLeader && pendingCount > 0 && (
            <span className="flex items-center gap-1 text-[10px] font-black text-orange-400 bg-orange-400/10 border border-orange-400/20 px-2 py-0.5 rounded-full">
              {pendingCount} req
            </span>
          )}
          <span
            className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border ${status.color}`}
          >
            {status.label}
          </span>
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-4 leading-relaxed">
        {project.description}
      </p>

      {/* Skills */}
      {project.requiredSkills.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.requiredSkills.slice(0, 4).map((rs, i) => (
            <span
              key={i}
              className="text-[11px] font-semibold text-violet-300 bg-violet-500/10 border border-violet-500/20 px-2.5 py-0.5 rounded-lg flex items-center gap-1"
            >
              {rs.proficiencyDesired === "expert" ? (
                <CheckCircle className="w-2.5 h-2.5" />
              ) : (
                <Circle className="w-2.5 h-2.5" />
              )}
              {rs.skill.name}
            </span>
          ))}
          {project.requiredSkills.length > 4 && (
            <span className="text-[11px] text-gray-500 bg-gray-50 dark:bg-gray-800 px-2.5 py-0.5 rounded-lg">
              +{project.requiredSkills.length - 4}
            </span>
          )}
        </div>
      )}

      {/* Meta Row */}
      <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
        <span className="flex items-center gap-1.5">
          <Users className="w-3.5 h-3.5" />
          {project.members.length} member
          {project.members.length !== 1 ? "s" : ""}
        </span>
        {project.deadline && (
          <span className="flex items-center gap-1.5">
            <CalendarDays className="w-3.5 h-3.5" />
            {new Date(project.deadline).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </span>
        )}
        {project.associatedEvent && (
          <span className="flex items-center gap-1.5">
            <Wrench className="w-3.5 h-3.5" />
            {project.associatedEvent.title}
          </span>
        )}
      </div>

      {/* Member Avatars */}
      {project.members.length > 0 && (
        <div className="flex items-center -space-x-2 mb-5">
          {project.members.slice(0, 5).map((member, i) => (
            <div
              key={member._id}
              title={member.name}
              className={`w-8 h-8 rounded-full border-2 border-gray-900 bg-gradient-to-br ${avatarColors[i % avatarColors.length]} flex items-center justify-center text-[10px] font-bold text-gray-900 dark:text-white ring-1 ring-white/10`}
            >
              {member.avatar ? (
                <img
                  src={member.avatar}
                  className="w-full h-full object-cover rounded-full"
                  alt={member.name}
                />
              ) : (
                member.name.charAt(0).toUpperCase()
              )}
            </div>
          ))}
          {project.members.length > 5 && (
            <div className="w-8 h-8 rounded-full border-2 border-gray-900 bg-gray-700 flex items-center justify-center text-[10px] font-bold text-gray-700 dark:text-gray-300">
              +{project.members.length - 5}
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        <Link
          to={`/teams/projects/${project._id}`}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-gray-50 dark:bg-gray-800 hover:bg-gray-700 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:text-white text-sm font-semibold rounded-xl transition-all"
        >
          <Eye className="w-4 h-4" /> View
        </Link>
        {isLeader ? (
          <Link
            to={`/teams/projects/${project._id}/edit`}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-400 hover:text-indigo-300 text-sm font-semibold rounded-xl border border-indigo-500/20 transition-all"
          >
            <Edit3 className="w-4 h-4" /> Manage
          </Link>
        ) : (
          project.status === "open" && (
            <Link
              to={`/teams/projects/${project._id}`}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 hover:text-emerald-300 text-sm font-semibold rounded-xl border border-emerald-500/20 transition-all"
            >
              <UserPlus className="w-4 h-4" /> Join
            </Link>
          )
        )}
      </div>
    </motion.div>
  );
};
