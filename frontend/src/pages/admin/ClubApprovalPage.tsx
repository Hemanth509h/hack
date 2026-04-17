import { useState } from 'react';
import { Calendar, Users, X, Check, MessageSquare, ShieldCheck } from 'lucide-react';
import { useGetPendingClubsQuery, useResolveClubApplicationMutation } from '../../features/admin/adminApi';

const mockPendingApps = [
  {
    id: 'req_1',
    name: 'Quantum Computing Society',
    category: 'Academic',
    description: 'A club dedicated to exploring quantum algorithms and hardware access.',
    proposedLeaders: [{ name: 'Alex Johnson', email: 'alex.j@quad.edu' }],
    expectedMembership: 45,
    applicationDate: '2026-03-28'
  },
  {
    id: 'req_2',
    name: 'Sustainable Campus Initiative',
    category: 'Volunteering',
    description: 'Focused on creating actionable eco-friendly projects across the campus.',
    proposedLeaders: [{ name: 'Sarah Williams', email: 'sarah.w@quad.edu' }, { name: 'Mike Chen', email: 'mike.c@quad.edu' }],
    expectedMembership: 120,
    applicationDate: '2026-04-02'
  }
];

const ClubApprovalPage = () => {
  const [selectedApp, setSelectedApp] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  // const { data: pendingClubs } = useGetPendingClubsQuery();
  const pendingClubs = mockPendingApps;

  const handleApprove = (id: string) => {
    // In actual implementation: useResolveClubApplicationMutation({ clubId: id, status: 'approved' })
    alert(`Approved club application ${id}`);
  };

  const handleReject = (id: string) => {
    // In actual implementation: useResolveClubApplicationMutation({ clubId: id, status: 'rejected', reason: rejectReason })
    alert(`Rejected club application ${id} for reason: ${rejectReason}`);
    setSelectedApp(null);
    setRejectReason('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
         <h1 className="text-3xl font-black mb-2">Club Approvals</h1>
         <p className="text-gray-400">Review and moderate pending organization applications.</p>
      </div>

      {pendingClubs.length === 0 ? (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-12 text-center shadow-xl">
           <div className="w-16 h-16 bg-blue-500/10 text-blue-400 rounded-full flex items-center justify-center mx-auto mb-4">
             <ShieldCheck size={32} />
           </div>
           <h3 className="text-xl font-bold text-white mb-2">You're all caught up!</h3>
           <p className="text-gray-400">There are no pending club applications right now.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {pendingClubs.map(app => (
            <div key={app.id} className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-xl relative overflow-hidden flex flex-col transition hover:border-gray-700">
               {/* Badge */}
               <div className="absolute top-6 right-6">
                 <span className="bg-purple-500/10 text-purple-400 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-purple-500/20">
                   {app.category}
                 </span>
               </div>
               
               <h3 className="text-xl font-bold text-white mb-2 pr-24">{app.name}</h3>
               <p className="text-gray-400 text-sm mb-6 flex-1">{app.description}</p>
               
               <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-950 rounded-xl p-3 border border-gray-800">
                    <div className="text-gray-500 text-xs font-semibold mb-1 flex items-center gap-1.5"><Calendar size={14}/> Applied</div>
                    <div className="text-gray-200 text-sm font-medium">{new Date(app.applicationDate).toLocaleDateString()}</div>
                  </div>
                  <div className="bg-gray-950 rounded-xl p-3 border border-gray-800">
                    <div className="text-gray-500 text-xs font-semibold mb-1 flex items-center gap-1.5"><Users size={14}/> Expected</div>
                    <div className="text-gray-200 text-sm font-medium">{app.expectedMembership} members</div>
                  </div>
               </div>

               <div className="mb-6">
                 <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Proposed Leaders</div>
                 <div className="space-y-2">
                   {app.proposedLeaders.map((leader, i) => (
                     <div key={i} className="flex justify-between items-center bg-gray-950 border border-gray-800 px-3 py-2 rounded-lg">
                       <span className="text-sm font-medium text-gray-200">{leader.name}</span>
                       <span className="text-xs text-gray-500">{leader.email}</span>
                     </div>
                   ))}
                 </div>
               </div>

               <div className="grid grid-cols-2 gap-3 mt-auto pt-6 border-t border-gray-800">
                  <button 
                    onClick={() => setSelectedApp(app.id)}
                    className="flex items-center justify-center gap-2 py-2.5 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-xl font-bold transition"
                  >
                     <X size={18} /> Reject
                  </button>
                  <button 
                    onClick={() => handleApprove(app.id)}
                    className="flex items-center justify-center gap-2 py-2.5 bg-green-500 text-gray-900 rounded-xl font-bold hover:bg-green-400 transition"
                  >
                     <Check size={18} /> Approve
                  </button>
               </div>

               {/* Rejection Modal overlay inline */}
               {selectedApp === app.id && (
                 <div className="absolute inset-0 bg-gray-900/95 p-6 backdrop-blur-sm z-10 flex flex-col justify-center animate-in fade-in zoom-in-95 duration-200">
                    <h4 className="text-lg font-bold text-red-400 mb-2 flex items-center gap-2">
                      <MessageSquare size={18} /> Rejection Feedback
                    </h4>
                    <p className="text-gray-400 text-sm mb-4">Provide a reason to the applicants. They will receive this via email and can re-apply.</p>
                    <textarea 
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      className="w-full h-32 bg-gray-950 border border-gray-700 rounded-xl p-3 text-sm text-gray-200 focus:border-red-500 focus:outline-none mb-4 resize-none custom-scrollbar"
                      placeholder="e.g. Please elaborate on your financial plan..."
                    />
                    <div className="flex gap-3">
                       <button onClick={() => setSelectedApp(null)} className="flex-1 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium transition">
                         Cancel
                       </button>
                       <button onClick={() => handleReject(app.id)} disabled={!rejectReason.trim()} className="flex-1 py-2 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white rounded-lg font-medium transition">
                         Confirm Rejection
                       </button>
                    </div>
                 </div>
               )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ClubApprovalPage;
