import { useState } from 'react';
import { Search, Filter, MoreVertical, Download, Shield, ShieldOff, Eye, Edit3, X, Check } from 'lucide-react';
import { useGetUsersQuery, useUpdateUserRoleMutation } from '../../features/admin/adminApi';
import { motion, AnimatePresence } from 'framer-motion';

const UserManagementPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [page, setPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  // Real endpoint hook
  const { data, isLoading } = useGetUsersQuery({ 
    page, 
    search: searchTerm, 
    role: roleFilter === 'All' ? undefined : roleFilter.toLowerCase() 
  });
  
  const [updateUserRole, { isLoading: isUpdatingRole }] = useUpdateUserRoleMutation();

  const filteredUsers = data?.users || [];

  const handleRoleUpdate = async (userId: string, newRole: string) => {
    try {
      await updateUserRole({ userId, role: newRole }).unwrap();
      setIsEditModalOpen(false);
    } catch (err) {
      console.error('Failed to update role', err);
    }
  };

  const openEditModal = (user: any) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row justify-between md:items-end gap-4">
        <div>
           <h1 className="text-3xl font-black mb-2">User Management</h1>
           <p className="text-gray-400">Manage student accounts, roles, and administrative access.</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition font-medium text-sm">
             <Download size={16} /> Export CSV
          </button>
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl shadow-xl overflow-hidden flex flex-col">
         {/* Toolbar */}
         <div className="p-4 border-b border-gray-800 flex flex-col md:flex-row gap-4 justify-between bg-gray-900/50">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input 
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-950 border border-gray-700 rounded-xl pl-10 pr-4 py-2 text-sm text-gray-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
              />
            </div>
            <div className="flex gap-3">
               <div className="relative">
                 <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                 <select 
                   value={roleFilter}
                   onChange={(e) => setRoleFilter(e.target.value)}
                   className="pl-9 pr-8 py-2 bg-gray-950 border border-gray-700 rounded-xl text-sm appearance-none text-gray-200 focus:outline-none focus:border-blue-500 transition cursor-pointer"
                 >
                   <option>All</option>
                   <option>Student</option>
                   <option>Club_Leader</option>
                   <option>Admin</option>
                 </select>
               </div>
            </div>
         </div>

         {/* Table */}
         <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
               <thead className="bg-gray-950/50 text-gray-400 border-b border-gray-800">
                  <tr>
                     <th className="px-6 py-4 font-semibold">Student</th>
                     <th className="px-6 py-4 font-semibold">Current Role</th>
                     <th className="px-6 py-4 font-semibold">Status</th>
                     <th className="px-6 py-4 font-semibold">Joined Date</th>
                     <th className="px-6 py-4 font-semibold text-right">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-gray-800">
                 {filteredUsers.map((user: any) => (
                   <tr key={user._id} className="hover:bg-gray-800/30 transition">
                     <td className="px-6 py-4">
                       <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold text-xs text-white">
                           {user.name.charAt(0)}
                         </div>
                         <div>
                           <div className="font-semibold text-gray-200">{user.name}</div>
                           <div className="text-gray-500 text-xs">{user.email}</div>
                         </div>
                       </div>
                     </td>
                     <td className="px-6 py-4">
                       <span className="bg-gray-800 text-gray-300 px-2.5 py-1 rounded-md text-xs font-medium uppercase tracking-wider">
                         {user.role}
                       </span>
                     </td>
                     <td className="px-6 py-4">
                       <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                         user.status === 'Active' ? 'bg-green-500/10 text-green-400' :
                         user.status === 'Suspended' ? 'bg-red-500/10 text-red-400' :
                         'bg-gray-500/10 text-gray-400'
                       }`}>
                         <span className={`w-1.5 h-1.5 rounded-full ${
                           user.status === 'Active' ? 'bg-green-400' : user.status === 'Suspended' ? 'bg-red-400' : 'bg-gray-400'
                         }`}></span>
                         {user.status}
                       </span>
                     </td>
                     <td className="px-6 py-4 text-gray-400">
                       {new Date(user.createdAt || user.joinedDate).toLocaleDateString()}
                     </td>
                     <td className="px-6 py-4 text-right">
                       <div className="flex items-center justify-end gap-2">
                         <button className="text-gray-400 hover:text-blue-400 p-1.5 transition" title="View Profile">
                           <Eye size={18} />
                         </button>
                         {user.role !== 'admin' ? (
                           <button 
                             onClick={() => handleRoleUpdate(user._id, 'admin')}
                             className="text-gray-400 hover:text-purple-400 p-1.5 transition" title="Make Admin"
                           >
                             <Shield size={18} />
                           </button>
                         ) : (
                           <button 
                             onClick={() => handleRoleUpdate(user._id, 'student')}
                             className="text-purple-400 hover:text-red-400 p-1.5 transition" title="Remove Admin"
                           >
                             <ShieldOff size={18} />
                           </button>
                         )}
                         <button 
                           onClick={() => openEditModal(user)}
                           className="text-gray-400 hover:text-white p-1.5 transition" title="Edit User"
                         >
                           <Edit3 size={18} />
                         </button>
                         <div className="relative group inline-block">
                           <button className="text-gray-400 hover:text-white p-1.5 transition">
                             <MoreVertical size={18} />
                           </button>
                         </div>
                       </div>
                     </td>
                   </tr>
                 ))}
                 {filteredUsers.length === 0 && (
                   <tr>
                     <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                        No users match your criteria.
                     </td>
                   </tr>
                 )}
               </tbody>
            </table>
         </div>
         {/* Pagination Footer */}
         <div className="p-4 border-t border-gray-800 bg-gray-900/50 flex items-center justify-between text-sm text-gray-400">
            <span>Showing {filteredUsers.length} users (Total: {data?.total || 0})</span>
            <div className="flex gap-2">
               <button 
                 onClick={() => setPage(p => Math.max(1, p - 1))}
                 disabled={page === 1}
                 className="px-3 py-1.5 bg-gray-800 rounded-lg hover:bg-gray-700 disabled:opacity-50 transition"
               >Previous</button>
               <button 
                 onClick={() => setPage(p => p + 1)}
                 disabled={filteredUsers.length === 0}
                 className="px-3 py-1.5 bg-gray-800 rounded-lg hover:bg-gray-700 disabled:opacity-50 transition"
               >Next</button>
            </div>
         </div>
      </div>

      <AnimatePresence>
        {isEditModalOpen && selectedUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-gray-900 border border-gray-800 rounded-[2rem] w-full max-w-md overflow-hidden shadow-2xl"
            >
              <div className="p-6 border-b border-gray-800 flex justify-between items-center">
                <h3 className="text-xl font-black text-white">Edit User Role</h3>
                <button onClick={() => setIsEditModalOpen(false)} className="text-gray-500 hover:text-white transition">
                  <X size={24} />
                </button>
              </div>

              <div className="p-8 space-y-8">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-black text-xl text-white">
                    {selectedUser.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-lg">{selectedUser.name}</h4>
                    <p className="text-gray-500 text-sm">{selectedUser.email}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">System Role</label>
                  <div className="grid grid-cols-1 gap-3">
                    {[
                      { id: 'student', label: 'Student', desc: 'Standard campus access', color: 'blue' },
                      { id: 'club_leader', label: 'Club Leader', desc: 'Manage events and club content', color: 'emerald' },
                      { id: 'admin', label: 'Administrator', desc: 'Full system control', color: 'indigo' },
                    ].map((role) => (
                      <button
                        key={role.id}
                        onClick={() => handleRoleUpdate(selectedUser._id, role.id)}
                        disabled={isUpdatingRole}
                        className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all group ${
                          selectedUser.role === role.id 
                            ? `bg-${role.color}-500/10 border-${role.color}-500/50 text-${role.color}-400` 
                            : 'bg-gray-950/50 border-gray-800 text-gray-500 hover:border-gray-700'
                        }`}
                      >
                        <div className="text-left">
                          <p className="font-black uppercase tracking-widest text-xs">{role.label}</p>
                          <p className="text-[10px] opacity-70">{role.desc}</p>
                        </div>
                        {selectedUser.role === role.id && <Check size={18} />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-6 bg-gray-950/50 border-t border-gray-800 flex justify-end">
                <button 
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-6 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-xl text-sm font-bold transition"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserManagementPage;
