import { useState } from 'react';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';
import { Download, Calendar as CalendarIcon, MapPin } from 'lucide-react';

const activeUsersData = [
  { month: 'Jan', users: 1200 }, { month: 'Feb', users: 1900 },
  { month: 'Mar', users: 2400 }, { month: 'Apr', users: 3800 },
  { month: 'May', users: 3500 }, { month: 'Jun', users: 4100 },
];

const eventCategoriesData = [
  { name: 'Academic', value: 35 },
  { name: 'Social', value: 25 },
  { name: 'Sports', value: 20 },
  { name: 'Career', value: 15 },
  { name: 'Arts', value: 5 },
];

const demographicsData = [
  { major: 'Computer Science', count: 850 },
  { major: 'Business', count: 620 },
  { major: 'Engineering', count: 540 },
  { major: 'Arts', count: 320 },
  { major: 'Science', count: 210 },
];

const COLORS = ['#6366f1', '#a855f7', '#ec4899', '#3b82f6', '#14b8a6'];

const AnalyticsPage = () => {
  const [dateRange, setDateRange] = useState('Last 6 Months');
  const [campusFilter, setCampusFilter] = useState('All Campuses');

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row justify-between md:items-end gap-4 mb-6">
        <div>
           <h1 className="text-3xl font-black mb-2 flex items-center gap-3">
             <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
               Campus Analytics
             </span>
           </h1>
           <p className="text-gray-400">Deep dive into platform engagement and demographics.</p>
        </div>
        <div className="flex gap-3 flex-wrap">
          <div className="flex bg-gray-900 border border-gray-800 rounded-xl overflow-hidden p-1">
             <button className="px-3 py-1.5 bg-gray-800 text-white rounded-lg text-sm font-medium">Overview</button>
             <button className="px-3 py-1.5 text-gray-400 hover:text-white rounded-lg text-sm font-medium transition">Demographics</button>
          </div>
          <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition font-medium text-sm shadow-lg shadow-blue-500/20">
             <Download size={16} /> Generate Report
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-6">
        <div className="relative">
          <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
          <select 
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="pl-9 pr-8 py-2 bg-gray-900 border border-gray-800 rounded-xl text-sm appearance-none text-gray-200 focus:border-blue-500 focus:outline-none cursor-pointer"
          >
            <option>Last 30 Days</option>
            <option>Last 6 Months</option>
            <option>Year to Date</option>
          </select>
        </div>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
          <select 
            value={campusFilter}
            onChange={(e) => setCampusFilter(e.target.value)}
            className="pl-9 pr-8 py-2 bg-gray-900 border border-gray-800 rounded-xl text-sm appearance-none text-gray-200 focus:border-blue-500 focus:outline-none cursor-pointer"
          >
            <option>All Campuses</option>
            <option>North Campus</option>
            <option>South Campus</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         {/* Active Users Line Chart */}
         <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <h3 className="text-lg font-bold mb-6">Active Users Growth</h3>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={activeUsersData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" />
                  <XAxis dataKey="month" stroke="#9CA3AF" tickLine={false} axisLine={false} />
                  <YAxis stroke="#9CA3AF" tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '8px' }}
                    itemStyle={{ color: '#818cf8', fontWeight: 'bold' }}
                  />
                  <Line type="monotone" dataKey="users" stroke="#818cf8" strokeWidth={3} dot={{ r: 4, fill: '#818cf8', strokeWidth: 0 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
         </div>

         {/* Event Categories Donut */}
         <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-xl relative overflow-hidden flex flex-col">
            <h3 className="text-lg font-bold mb-2">Event Categories Breakdown</h3>
            <div className="h-[280px] flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={eventCategoriesData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {eventCategoriesData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '8px', color: '#fff' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </div>
         </div>

         {/* Top Demographics Bar Chart */}
         <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-xl relative overflow-hidden lg:col-span-2">
            <h3 className="text-lg font-bold mb-6">User Demographics by Major</h3>
            <div className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={demographicsData} layout="vertical" margin={{ top: 5, right: 30, left: 100, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#374151" />
                  <XAxis type="number" stroke="#9CA3AF" tickLine={false} axisLine={false} />
                  <YAxis dataKey="major" type="category" stroke="#D1D5DB" tickLine={false} axisLine={false} tick={{ fontSize: 13 }} width={120} />
                  <Tooltip 
                    cursor={{fill: '#1F2937'}}
                    contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '8px' }}
                  />
                  <Bar dataKey="count" fill="#a855f7" radius={[0, 4, 4, 0]} barSize={24}>
                    {demographicsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[(index + 1) % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
         </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
