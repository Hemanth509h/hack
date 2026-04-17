import { useState } from 'react';
import { 
  Users, CalendarEvent, ShieldCheck, Activity, 
  TrendingUp, TrendingDown, ArrowRight, ExternalLink
} from 'lucide-react';
import { motion } from 'framer-motion';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';

// Mock data based on requirements
const trendData = [
  { day: 'Mon', rsvps: 120 },
  { day: 'Tue', rsvps: 154 },
  { day: 'Wed', rsvps: 205 },
  { day: 'Thu', rsvps: 280 },
  { day: 'Fri', rsvps: 450 },
  { day: 'Sat', rsvps: 340 },
  { day: 'Sun', rsvps: 110 },
];

const StatCard = ({ title, value, subValue, change, isPositive, icon: Icon, alert = false }: any) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className={`bg-gray-900 border ${alert ? 'border-red-500/50' : 'border-gray-800'} rounded-2xl p-6 shadow-xl relative overflow-hidden`}
  >
    <div className="absolute -right-6 -top-6 w-24 h-24 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-2xl" />
    <div className="flex justify-between items-start">
      <div>
        <p className="text-gray-400 font-medium mb-1">{title}</p>
        <h3 className="text-3xl font-black text-white">{value}</h3>
      </div>
      <div className={`p-3 rounded-xl ${alert ? 'bg-red-500/20 text-red-400' : 'bg-gray-800 text-blue-400'}`}>
        <Icon size={24} />
      </div>
    </div>
    <div className="mt-4 flex items-center gap-2">
      {change && (
        <span className={`flex items-center text-sm font-semibold ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
          {isPositive ? <TrendingUp size={16} className="mr-1" /> : <TrendingDown size={16} className="mr-1" />}
          {change}%
        </span>
      )}
      <span className="text-gray-500 text-sm">{subValue}</span>
    </div>
  </motion.div>
);

const AdminDashboardPage = () => {
  const [dateRange, setDateRange] = useState('Week');

  return (
    <div className="space-y-8 animate-in fade-in zoom-in-95 duration-300">
      <div className="flex justify-between items-end">
        <div>
           <h1 className="text-3xl font-black mb-2 flex items-center gap-3">
             <span>Campus Pulse Dashboard</span>
           </h1>
           <p className="text-gray-400">Welcome back, Admin. Real-time campus overview.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Active Students" 
          value="4,208" 
          change={12.5} 
          isPositive={true} 
          subValue="vs last month"
          icon={Users}
        />
        <StatCard 
          title="Upcoming Events" 
          value="45" 
          change={5.2} 
          isPositive={true} 
          subValue="scheduled"
          icon={CalendarEvent}
        />
        <StatCard 
          title="New Club Requests" 
          value="12" 
          subValue="3 high priority"
          icon={ShieldCheck}
          alert={true}
        />
        <StatCard 
          title="System Health" 
          value="Operational" 
          subValue="All services running"
          icon={Activity}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
           <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Student Engagement Trends (RSVPs)</h3>
              <select 
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="bg-gray-800 border border-gray-700 text-gray-200 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2"
              >
                <option value="Week">This Week</option>
                <option value="Month">This Month</option>
              </select>
           </div>
           
           <div className="h-[300px] w-full">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={trendData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" />
                 <XAxis dataKey="day" stroke="#9CA3AF" tickLine={false} axisLine={false} />
                 <YAxis stroke="#9CA3AF" tickLine={false} axisLine={false} />
                 <Tooltip 
                   cursor={{fill: '#1F2937'}}
                   contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '8px' }}
                 />
                 <Bar dataKey="rsvps" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={40} />
               </BarChart>
             </ResponsiveContainer>
           </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
             <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
             <div className="space-y-3">
                <button className="w-full flex justify-between items-center bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded-xl px-4 py-3 transition">
                  <span className="font-semibold">Review Club Forms</span>
                  <div className="flex items-center gap-2">
                    <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">12 pending</span>
                  </div>
                </button>
                <button className="w-full flex justify-between items-center bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700 rounded-xl px-4 py-3 transition">
                  <span className="font-semibold">User Role Management</span>
                  <ArrowRight size={16} />
                </button>
                <button className="w-full flex justify-between items-center bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700 rounded-xl px-4 py-3 transition">
                  <span className="font-semibold">Audit Logs</span>
                  <ArrowRight size={16} />
                </button>
             </div>
          </div>

          <div className="bg-gradient-to-br from-purple-900 to-indigo-900 border border-purple-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden text-center">
             <h3 className="text-xl font-bold mb-2 text-white">Need help?</h3>
             <p className="text-purple-200 text-sm mb-4">Consult the administrator handbook for workflows and SOPs.</p>
             <button className="inline-flex items-center gap-2 bg-white text-purple-900 px-4 py-2 rounded-xl font-bold text-sm hover:scale-105 transition-transform">
                Read Docs <ExternalLink size={16} />
             </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboardPage;
