import React from "react";
import { Code, Search } from "lucide-react";

export const SkillsList = ({ skills }) => {
  if (!skills || skills.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-6 border border-dashed border-gray-700 rounded-xl bg-white dark:bg-gray-900/50">
        <Search className="w-6 h-6 text-gray-500 mb-2" />
        <span className="text-gray-500 text-sm">No skills listed yet.</span>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {skills.map((s) => (
        <span
          key={s._id}
          className="group flex items-center px-3 py-1.5 bg-gray-50 dark:bg-gray-800 border border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:border-primary-500 hover:bg-primary-900/20 hover:text-primary-400 transition-all cursor-default shadow-sm"
        >
          <Code className="w-3.5 h-3.5 mr-2 opacity-50 group-hover:opacity-100 transition-opacity" />
          {s.name}
        </span>
      ))}
    </div>
  );
};
