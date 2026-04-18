import React from "react";
import {
  Check,
  X,
  Shield,
  ShieldAlert,
  MoreHorizontal,
  User,
} from "lucide-react";
import {
  useApproveMemberMutation,
  useRejectMemberMutation,
  useUpdateMemberRoleMutation,
} from "../../../services/clubApi";

export const MemberManagementTable = ({ members, clubId }) => {
  const [approve] = useApproveMemberMutation();
  const [reject] = useRejectMemberMutation();
  const [updateRole] = useUpdateMemberRoleMutation();

  const handleRoleChange = (userId, currentRole) => {
    const newRole = currentRole === "member" ? "board" : "member";
    updateRole({ clubId, userId, role: newRole });
  };

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl overflow-hidden shadow-2xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-950/50 border-bottom border-gray-200 dark:border-gray-800">
              <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                Student
              </th>
              <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                Status
              </th>
              <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                Role
              </th>
              <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                Joined On
              </th>
              <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/50">
            {members.map((member) => (
              <tr
                key={member._id}
                className="hover:bg-gray-800/30 transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gray-50 dark:bg-gray-800 overflow-hidden">
                      {member.user.avatar ? (
                        <img
                          src={member.user.avatar}
                          alt={member.user.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-gray-500">
                          <User className="h-5 w-5" />
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-gray-900 dark:text-white">
                        {member.user.name}
                      </div>
                      <div className="text-[10px] text-gray-500">
                        {member.user.major}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                      member.status === "approved"
                        ? "bg-green-500/10 text-green-400"
                        : member.status === "pending"
                          ? "bg-amber-500/10 text-amber-400"
                          : "bg-red-500/10 text-red-400"
                    }`}
                  >
                    {member.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {member.role === "president" ? (
                      <ShieldAlert className="h-4 w-4 text-amber-500" />
                    ) : member.role === "board" ? (
                      <Shield className="h-4 w-4 text-indigo-400" />
                    ) : null}
                    <span className="text-xs text-gray-700 dark:text-gray-300 capitalize">
                      {member.role}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-xs text-gray-500">
                  {new Date(member.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {member.status === "pending" ? (
                      <>
                        <button
                          onClick={() =>
                            approve({ clubId, userId: member.user._id })
                          }
                          className="p-1.5 rounded-lg bg-green-500/10 text-green-400 hover:bg-green-500 hover:text-gray-900 dark:text-white transition-all"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() =>
                            reject({ clubId, userId: member.user._id })
                          }
                          className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-gray-900 dark:text-white transition-all"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </>
                    ) : (
                      member.role !== "president" && (
                        <button
                          onClick={() =>
                            handleRoleChange(member.user._id, member.role)
                          }
                          className="p-1.5 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:text-white transition-all"
                          title="Toggle Board Member Role"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                      )
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
