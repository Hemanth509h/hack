import { useState } from 'react';
// Dashboard Sync: 2026-04-18T14:15:00Z - Refreshing admin actions
import { 
  Users, Calendar, ShieldCheck, Activity, 
  TrendingUp, TrendingDown, ArrowRight, ExternalLink, PlusCircle, Megaphone
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

import { useGetAdminStatsQuery } from '../../features/admin/adminApi';

const StatCard = ({ title, value, subValue, change, isPositive, icon: Icon, alert = false }: any) => (
  <motion.div 
    whileHover={{ y: -8, scale: 1.02 }}
    className={cn(
      "glass rounded-[2.5rem] p-8 shadow-[0_20px_40px_rgba(0,0,0,0.3)] relative overflow-hidden border-black/5 dark:border-white/5",
      alert && "ring-2 ring-red-500/30"
    )}
  >
    <div className="absolute -right-10 -top-10 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-colors" />
    <div className="flex justify-between items-start relative z-10">
      <div>
        <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] mb-3">{title}</p>
        <h3 className="text-4xl font-display font-black text-gray-900 dark:text-white tracking-tighter leading-tight">{value}</h3>
      </div>
      <div className={cn(
        "p-4 rounded-2xl shadow-lg",
        alert ? 'premium-gradient text-gray-900 dark:text-white' : 'glass bg-black/5 dark:bg-white/5 text-indigo-400 border-black/10 dark:border-white/10'
      )}>
        <Icon size={24} />
      </div>
    </div>
    <div className="mt-8 flex items-center gap-3 relative z-10">
      {change && (
        <span className={cn(
          "flex items-center px-3 py-1 rounded-full text-xs font-black tracking-widest uppercase",
          isPositive ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"
        )}>
          {isPositive ? <TrendingUp size={14} className="mr-1.5" /> : <TrendingDown size={14} className="mr-1.5" />}
          {change}%
        </span>
      )}
      <span className="text-gray-500 text-xs font-bold uppercase tracking-widest">{subValue}</span>
    </div>
  </motion.div>
);

const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState('Week');
  
  const { data: stats, isLoading } = useGetAdminStatsQuery({ range: dateRange });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-6">
        <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
        <p className="text-gray-500 font-bold uppercase tracking-widest text-sm">Aggregating Campus Data...</p>
      </div>
    );
  }

  const trendData = stats?.engagementTrends || [];

  return (
    <div className="space-y-12 py-6">
      <div className="flex flex-col md:flex-row justify-between items-center md:items-end gap-8 px-4">
        <div className="text-center md:text-left">
           <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-block px-4 py-1.5 mb-4 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em]"
            >
              Command & Control
            </motion.div>
           <h1 className="text-5xl md:text-7xl font-display font-black text-gray-900 dark:text-white mb-4 tracking-tighter leading-[0.9]">
             Campus <br />
             <span className="text-gradient">Intelligence.</span>
           </h1>
           <p className="text-gray-500 font-medium text-xl max-w-xl leading-relaxed">System-wide overview of engagement, health, and operational metrics.</p>
        </div>
        <div className="flex gap-4">
           <button className="btn-glass px-8 py-4 border-black/10 dark:border-white/10 text-gray-900 dark:text-white font-black uppercase tracking-widest text-xs">
              Generate Report
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        <StatCard 
          title="Active Students" 
          value={stats?.activeStudents?.total?.toString() || "0"} 
          change={stats?.activeStudents?.changePercentage} 
          isPositive={(stats?.activeStudents?.changePercentage || 0) >= 0} 
          subValue="vs last month"
          icon={Users}
        />
        <StatCard 
          title="Upcoming Events" 
          value={stats?.upcomingEvents?.total?.toString() || "0"} 
          change={stats?.upcomingEvents?.changePercentage} 
          isPositive={(stats?.upcomingEvents?.changePercentage || 0) >= 0} 
          subValue="scheduled"
          icon={Calendar}
        />
        <StatCard 
          title="New Club Requests" 
          value={stats?.newClubRequests?.total?.toString() || "0"} 
          subValue={stats?.newClubRequests?.hasHighPriority ? "Urgent Attention" : "Standard Review"}
          icon={ShieldCheck}
          alert={stats?.newClubRequests?.hasHighPriority}
        />
        <StatCard 
          title="System Health" 
          value={stats?.systemHealth?.status || "Operational"} 
          subValue="API Latency Optimal"
          icon={Activity}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 glass rounded-[3rem] p-10 shadow-[0_30px_60px_rgba(0,0,0,0.4)] relative overflow-hidden border-black/5 dark:border-white/5">
           <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-6">
              <div>
                <h3 className="text-3xl font-display font-black text-gray-900 dark:text-white tracking-tighter">Engagement Velocity</h3>
                <p className="text-gray-500 font-medium mt-1">Real-time RSVP volume across {dateRange.toLowerCase()}ly periods.</p>
              </div>
              <div className="glass bg-black/5 dark:bg-white/5 p-1 rounded-2xl border-black/10 dark:border-white/10">
                <select 
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="bg-transparent text-gray-900 dark:text-white text-[10px] font-black uppercase tracking-widest p-3 pr-8 focus:outline-none cursor-pointer"
                >
                  <option value="Week" className="bg-gray-50 dark:bg-[#030303]">Weekly Period</option>
                  <option value="Month" className="bg-gray-50 dark:bg-[#030303]">Monthly Period</option>
                </select>
              </div>
           </div>
           
           <div className="h-[350px] w-full">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={trendData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                 <defs>
                   <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="0%" stopColor="#6366f1" />
                     <stop offset="100%" stopColor="#8b5cf6" />
                   </linearGradient>
                 </defs>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                 <XAxis dataKey="day" stroke="rgba(255,255,255,0.3)" tickLine={false} axisLine={false} tick={{fontSize: 10, fontWeight: 900}} dy={15} />
                 <YAxis stroke="rgba(255,255,255,0.3)" tickLine={false} axisLine={false} tick={{fontSize: 10, fontWeight: 900}} />
                 <Tooltip 
                   cursor={{fill: 'rgba(255,255,255,0.03)'}}
                   contentStyle={{ backgroundColor: '#030303', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '24px', padding: '16px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}
                   itemStyle={{ color: '#fff', fontWeight: 900, fontSize: '14px' }}
                   labelStyle={{ color: 'rgba(255,255,255,0.5)', fontWeight: 900, fontSize: '10px', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.1em' }}
                 />
                 <Bar dataKey="rsvps" fill="url(#barGradient)" radius={[8, 8, 8, 8]} barSize={40} />
               </BarChart>
             </ResponsiveContainer>
           </div>
        </div>

        <div className="flex flex-col gap-10">
          <div className="glass rounded-[3rem] p-10 shadow-2xl border-black/5 dark:border-white/5 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-3xl -mr-16 -mt-16" />
             <h3 className="text-2xl font-display font-black text-gray-900 dark:text-white mb-8 tracking-tighter">Strategic Actions</h3>
             <div className="space-y-4">
                 <button 
                   onClick={() => navigate('/admin/clubs/pending')}
                   className="w-full flex justify-between items-center glass bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-gray-900 dark:text-white rounded-2xl px-6 py-5 transition-all duration-300 border-black/5 dark:border-white/5 hover:border-indigo-500/30"
                 >
                   <span className="font-black text-xs uppercase tracking-widest">Manage Clubs</span>
                   <div className="flex items-center gap-3">
                     <span className="bg-indigo-600 text-gray-900 dark:text-white text-[10px] font-black px-3 py-1 rounded-full shadow-[0_0_15px_rgba(99,102,241,0.4)]">{stats?.newClubRequests?.total || 0}</span>
                   </div>
                 </button>
                 <button 
                   onClick={() => navigate('/clubs/create')}
                   className="w-full flex justify-between items-center glass bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 rounded-2xl px-6 py-5 transition-all duration-300 border border-indigo-500/20"
                 >
                   <span className="font-black text-xs uppercase tracking-widest">Add New Club</span>
                   <PlusCircle size={16} />
                 </button>
                 <button 
                   onClick={() => navigate('/events/create')}
                   className="w-full flex justify-between items-center glass bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 rounded-2xl px-6 py-5 transition-all duration-300 border border-purple-500/20"
                 >
                   <span className="font-black text-xs uppercase tracking-widest">Schedule Event</span>
                   <PlusCircle size={16} />
                 </button>
                 <button 
                   onClick={() => navigate('/admin/broadcast')}
                   className="w-full flex justify-between items-center glass bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-2xl px-6 py-5 transition-all duration-300 border border-red-500/20"
                 >
                   <span className="font-black text-xs uppercase tracking-widest">System Broadcast</span>
                   <Megaphone size={16} />
                 </button>
                <button className="w-full flex justify-between items-center glass bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-gray-900 dark:text-white rounded-2xl px-6 py-5 transition-all duration-300 border-black/5 dark:border-white/5">
                  <span className="font-black text-xs uppercase tracking-widest">Identity Management</span>
                  <ArrowRight size={16} className="text-indigo-500" />
                </button>
                <button className="w-full flex justify-between items-center glass bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-gray-900 dark:text-white rounded-2xl px-6 py-5 transition-all duration-300 border-black/5 dark:border-white/5">
                  <span className="font-black text-xs uppercase tracking-widest">Global Audit Logs</span>
                  <ArrowRight size={16} className="text-indigo-500" />
                </button>
             </div>
          </div>

          <div className="premium-gradient rounded-[3rem] p-10 shadow-[0_30px_60px_rgba(99,102,241,0.3)] relative overflow-hidden flex flex-col items-center text-center">
             <div className="absolute inset-0 bg-black/10 dark:bg-white/10 opacity-20 pointer-events-none" />
             <ShieldCheck size={48} className="text-gray-900 dark:text-white mb-6" />
             <h3 className="text-2xl font-display font-black text-gray-900 dark:text-white mb-4 tracking-tighter">Admin Codex</h3>
             <p className="text-indigo-100 text-base mb-10 font-medium leading-relaxed">Consult the core protocols for system governance and conflict resolution.</p>
             <button className="w-full bg-white text-indigo-900 px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-105 transition-transform shadow-xl shadow-black/20">
                Access Handbook <ExternalLink size={16} className="inline-block ml-2" />
             </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboardPage;
