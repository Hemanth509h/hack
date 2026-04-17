import { useState } from 'react';
import { 
  Server, Database, Activity, Cpu, RotateCw, Trash2, ShieldAlert
} from 'lucide-react';

const SystemManagementPage = () => {
  const [isClearing, setIsClearing] = useState(false);
  const [announcement, setAnnouncement] = useState('');

  const handleClearCache = () => {
    setIsClearing(true);
    setTimeout(() => {
      setIsClearing(false);
      alert('Redis cache cleared successfully.');
    }, 1500);
  };

  const logs = [
    { time: '2026-04-17T09:12:45Z', level: 'ERROR', color: 'text-red-400', msg: '[AuthService] Failed to validate OAuth token from Google provider.' },
    { time: '2026-04-17T08:44:12Z', level: 'WARN',  color: 'text-yellow-400', msg: "[Database] Slow query detected on clubs.find({ category: 'Sports' }). Duration: 1200ms." },
    { time: '2026-04-17T07:22:01Z', level: 'ERROR', color: 'text-red-400', msg: "[RedisClient] Connection timeout when writing key 'user:4092:session'. Retrying..." },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
         <h1 className="text-3xl font-black mb-2">System Management</h1>
         <p className="text-gray-400">Monitor infrastructure health and perform maintenance tasks.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* API Server */}
        <div className="bg-gray-900 border border-green-500/30 rounded-2xl p-5 shadow-[0_0_15px_rgba(34,197,94,0.1)] relative">
          <div className="absolute top-5 right-5 w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.8)]" />
          <div className="flex items-center gap-3 mb-4">
             <div className="p-2.5 bg-gray-800 rounded-lg text-gray-300"><Server size={20} /></div>
             <div>
               <h4 className="font-bold text-gray-200 leading-tight">API Server</h4>
               <span className="text-green-400 text-xs font-semibold">Online</span>
             </div>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-gray-400"><span>Response Time</span><span className="text-gray-200">42ms</span></div>
            <div className="flex justify-between text-gray-400"><span>Uptime</span><span className="text-gray-200">99.98%</span></div>
          </div>
        </div>

        {/* Database */}
        <div className="bg-gray-900 border border-green-500/30 rounded-2xl p-5 relative">
          <div className="absolute top-5 right-5 w-3 h-3 bg-green-500 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.8)]" />
          <div className="flex items-center gap-3 mb-4">
             <div className="p-2.5 bg-gray-800 rounded-lg text-gray-300"><Database size={20} /></div>
             <div>
               <h4 className="font-bold text-gray-200 leading-tight">MongoDB</h4>
               <span className="text-green-400 text-xs font-semibold">Connected</span>
             </div>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-gray-400"><span>Active Conns</span><span className="text-gray-200">124</span></div>
            <div className="flex justify-between text-gray-400"><span>Storage</span><span className="text-gray-200">1.2 GB</span></div>
          </div>
        </div>

        {/* Redis Cache */}
        <div className="bg-gray-900 border border-yellow-500/30 rounded-2xl p-5 relative">
          <div className="absolute top-5 right-5 w-3 h-3 bg-yellow-500 rounded-full shadow-[0_0_10px_rgba(234,179,8,0.8)] animate-pulse" />
          <div className="flex items-center gap-3 mb-4">
             <div className="p-2.5 bg-gray-800 rounded-lg text-gray-300"><Cpu size={20} /></div>
             <div>
               <h4 className="font-bold text-gray-200 leading-tight">Redis Cache</h4>
               <span className="text-yellow-400 text-xs font-semibold">High Load</span>
             </div>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-gray-400"><span>Hit Rate</span><span className="text-yellow-400">94.2%</span></div>
            <div className="flex justify-between text-gray-400"><span>Memory</span><span className="text-gray-200">456 MB</span></div>
          </div>
        </div>

        {/* WebSockets */}
        <div className="bg-gray-900 border border-green-500/30 rounded-2xl p-5 relative">
          <div className="absolute top-5 right-5 w-3 h-3 bg-green-500 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.8)]" />
          <div className="flex items-center gap-3 mb-4">
             <div className="p-2.5 bg-gray-800 rounded-lg text-gray-300"><Activity size={20} /></div>
             <div>
               <h4 className="font-bold text-gray-200 leading-tight">WebSockets</h4>
               <span className="text-green-400 text-xs font-semibold">Stable</span>
             </div>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-gray-400"><span>Connected</span><span className="text-gray-200">3,450 clients</span></div>
            <div className="flex justify-between text-gray-400"><span>Events/min</span><span className="text-gray-200">~240</span></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-xl relative overflow-hidden flex flex-col">
           <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <ShieldAlert size={20} className="text-red-500" /> Error Logs Viewer
              </h3>
              <button className="text-xs flex items-center gap-1.5 bg-gray-800 hover:bg-gray-700 px-3 py-1.5 rounded-lg transition text-gray-300">
                <RotateCw size={14} /> Refresh
              </button>
           </div>
           
           <div className="bg-gray-950 border border-gray-800 rounded-xl flex-1 font-mono text-xs p-4 overflow-y-auto space-y-3 custom-scrollbar h-[300px]">
             {logs.map((log, i) => (
               <div key={i} className="flex gap-4 items-start">
                 <span className="text-gray-500 whitespace-nowrap">{log.time}</span>
                 <span className={`${log.color} font-bold w-12 flex-shrink-0`}>{log.level}</span>
                 <span className="text-gray-300">{log.msg}</span>
               </div>
             ))}
           </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
             <h3 className="text-lg font-bold mb-2 text-white">Maintenance Actions</h3>
             <p className="text-sm text-gray-400 mb-6 border-b border-gray-800 pb-4">Tools to manage system states and performance.</p>
             
             <div className="space-y-4">
               <div>
                  <button 
                    onClick={handleClearCache}
                    disabled={isClearing}
                    className="w-full flex items-center justify-between py-2.5 px-4 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-xl transition font-medium border border-gray-700 disabled:opacity-50"
                  >
                    <span className="flex items-center gap-2"><Trash2 size={18} className="text-gray-400"/> Clear Redis Cache</span>
                    {isClearing && <RotateCw size={16} className="animate-spin text-gray-500" />}
                  </button>
                  <p className="text-[11px] text-gray-500 mt-2 px-1">Clearing cache will momentarily increase DB load.</p>
               </div>
             </div>
          </div>
          
          <div className="bg-gradient-to-br from-blue-900/40 to-purple-900/40 border border-blue-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
             <h3 className="text-lg font-bold mb-4 text-white">System Announcement</h3>
             <textarea 
                value={announcement}
                onChange={e => setAnnouncement(e.target.value)}
                placeholder="Type an announcement to broadcast to all active users..."
                className="w-full bg-gray-950/50 border border-gray-700 text-sm text-white focus:border-blue-500 rounded-xl p-3 resize-none h-24 mb-3"
             />
             <button disabled={!announcement.trim()} className="w-full font-bold bg-blue-600 hover:bg-blue-500 cursor-pointer disabled:bg-gray-700 disabled:cursor-not-allowed disabled:text-gray-500 text-white py-2 rounded-xl transition">
               Broadcast Message
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemManagementPage;
