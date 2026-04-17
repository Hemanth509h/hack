import { useState } from 'react';
import { Search, Filter, MoreVertical, Download, Shield, ShieldOff, Eye } from 'lucide-react';
// import { useGetUsersQuery } from '../../features/admin/adminApi';

// Mock users to develop UI immediately
const mockUsers = [
  { id: '1', name: 'Alex Johnson', email: 'alex.j@quad.edu', role: 'admin', status: 'Active', joinedDate: '2025-08-15' },
  { id: '2', name: 'Sarah Williams', email: 'sarah.w@quad.edu', role: 'student', status: 'Active', joinedDate: '2025-09-01' },
  { id: '3', name: 'Mike Chen', email: 'mike.c@quad.edu', role: 'student', status: 'Inactive', joinedDate: '2025-09-12' },
  { id: '4', name: 'Emily Davis', email: 'emily.d@quad.edu', role: 'club_admin', status: 'Active', joinedDate: '2025-10-05' },
  { id: '5', name: 'James Wilson', email: 'james.w@quad.edu', role: 'student', status: 'Suspended', joinedDate: '2026-01-20' },
];

const UserManagementPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  
  // Real endpoint hook
  // const { data, isLoading } = useGetUsersQuery({ page: 1, search: searchTerm, role: roleFilter });

  
  const filteredUsers = mockUsers.filter(u => 
    (roleFilter === 'All' || u.role === roleFilter.toLowerCase() || (roleFilter === 'Student' && u.role === 'student')) &&
    (u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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
                   <option>Club_Admin</option>
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
                 {filteredUsers.map((user) => (
                   <tr key={user.id} className="hover:bg-gray-800/30 transition">
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
                       {new Date(user.joinedDate).toLocaleDateString()}
                     </td>
                     <td className="px-6 py-4 text-right">
                       <div className="flex items-center justify-end gap-2">
                         <button className="text-gray-400 hover:text-blue-400 p-1.5 transition" title="View Profile">
                           <Eye size={18} />
                         </button>
                         {user.role !== 'admin' ? (
                           <button className="text-gray-400 hover:text-purple-400 p-1.5 transition" title="Make Admin">
                             <Shield size={18} />
                           </button>
                         ) : (
                           <button className="text-purple-400 hover:text-red-400 p-1.5 transition" title="Remove Admin">
                             <ShieldOff size={18} />
                           </button>
                         )}
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
            <span>Showing {filteredUsers.length} users</span>
            <div className="flex gap-2">
               <button className="px-3 py-1.5 bg-gray-800 rounded-lg hover:bg-gray-700 transition" disabled>Previous</button>
               <button className="px-3 py-1.5 bg-gray-800 rounded-lg hover:bg-gray-700 transition">Next</button>
            </div>
         </div>
      </div>
    </div>
  );
};

export default UserManagementPage;
