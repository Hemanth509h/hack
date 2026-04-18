import React from "react";
import { User, Search } from "lucide-react";

export const MemberList = ({ members }) => {
  const [searchTerm, setSearchTerm] = React.useState("");
  const filteredMembers = members.filter(
    (m) =>
      m.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.user.major?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Community
        </h2>
        <div className="relative w-full max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search members..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl pl-10 pr-4 py-2 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {filteredMembers.map((member) => (
          <div
            key={member._id}
            className="bg-gray-100 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 p-4 rounded-2xl flex flex-col items-center text-center group hover:bg-gray-900 transition-all"
          >
            <div className="h-16 w-16 rounded-full overflow-hidden border-2 border-gray-200 dark:border-gray-800 group-hover:border-indigo-500 transition-colors mb-3">
              {member.user.avatar ? (
                <img
                  src={member.user.avatar}
                  alt={member.user.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400">
                  <User className="h-8 w-8" />
                </div>
              )}
            </div>
            <h4 className="text-sm font-bold text-gray-900 dark:text-white truncate w-full">
              {member.user.name}
            </h4>
            <p className="text-[10px] text-gray-500 truncate w-full uppercase tracking-tighter">
              {member.user.major || "Student"}
            </p>
          </div>
        ))}
        {filteredMembers.length === 0 && (
          <div className="col-span-full py-12 text-center text-gray-500">
            No members found matching your search.
          </div>
        )}
      </div>
    </div>
  );
};
