import { useState } from 'react';
import { motion } from 'framer-motion';
import { Megaphone, Send, Info, ShieldAlert } from 'lucide-react';
import { useClearCacheMutation } from '../../features/admin/adminApi'; // Reusing for now or we could add a broadcast mutation

export default function BroadcastPage() {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [priority, setPriority] = useState('normal');
  const [isSending, setIsSending] = useState(false);
  const [sentStatus, setSentStatus] = useState<string | null>(null);

  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    
    // Simulating API call for broadcast
    setTimeout(() => {
      setIsSending(false);
      setSentStatus('Signal broadcasted successfully to all active frequencies.');
      setTitle('');
      setMessage('');
    }, 1500);
  };

  return (
    <div className="space-y-10 py-6 max-w-4xl">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
         <div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-block px-4 py-1.5 mb-4 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-black uppercase tracking-[0.2em]"
            >
              System Override
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-display font-black mb-3 tracking-tighter text-gray-900 dark:text-white">Global Broadcast</h1>
            <p className="text-gray-500 font-medium text-lg">Dispatch priority signals to every student in the ecosystem.</p>
         </div>
         <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-2xl flex items-center justify-center shadow-inner">
            <Megaphone size={32} />
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8">
          <form onSubmit={handleBroadcast} className="glass rounded-[3rem] p-10 shadow-2xl border-black/5 dark:border-white/5 space-y-8 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 blur-[100px] -mr-32 -mt-32" />
             
             <div className="space-y-2 relative z-10">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-2">Signal Heading</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  placeholder="E.g., Campus-wide Infrastructure Maintenance"
                  className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl px-6 py-4 text-gray-900 dark:text-white focus:border-red-500/50 outline-none transition-all"
                />
             </div>

             <div className="space-y-2 relative z-10">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-2">Broadcast Payload</label>
                <textarea 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  rows={6}
                  placeholder="Enter the critical information to be transmitted..."
                  className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-3xl px-6 py-5 text-gray-900 dark:text-white focus:border-red-500/50 outline-none transition-all resize-none"
                />
             </div>

             <div className="flex flex-wrap gap-4 relative z-10">
                {['normal', 'urgent', 'critical'].map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                      priority === p 
                        ? 'bg-red-500 text-gray-900 dark:text-white border-red-500 shadow-lg shadow-red-500/20' 
                        : 'bg-black/5 dark:bg-white/5 text-gray-500 border-black/10 dark:border-white/10 hover:text-red-400'
                    }`}
                  >
                    {p}
                  </button>
                ))}
             </div>

             <button 
               type="submit"
               disabled={isSending || !title || !message}
               className="w-full py-5 premium-gradient rounded-2xl text-gray-900 dark:text-white font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 shadow-xl shadow-red-500/20 disabled:opacity-50 transition-all active:scale-[0.98]"
             >
                {isSending ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Send size={18} /> Transmit Signal
                  </>
                )}
             </button>

             {sentStatus && (
               <motion.div 
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 className="p-5 bg-green-500/10 border border-green-500/20 rounded-2xl text-green-400 text-xs font-bold text-center"
               >
                 {sentStatus}
               </motion.div>
             )}
          </form>
        </div>

        <div className="lg:col-span-4 space-y-6">
           <div className="glass rounded-[2.5rem] p-8 border-black/5 dark:border-white/5">
              <div className="flex items-center gap-3 text-red-400 mb-6">
                 <ShieldAlert size={20} />
                 <h4 className="text-sm font-black uppercase tracking-widest">Protocol Warning</h4>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed font-medium">
                Global broadcasts are irreversible and trigger instant notifications across all active student devices. Use with extreme discretion.
              </p>
           </div>

           <div className="glass rounded-[2.5rem] p-8 border-black/5 dark:border-white/5">
              <div className="flex items-center gap-3 text-indigo-400 mb-6">
                 <Info size={20} />
                 <h4 className="text-sm font-black uppercase tracking-widest">Broadcast History</h4>
              </div>
              <div className="space-y-4">
                 <div className="p-4 bg-black/5 dark:bg-white/5 rounded-xl border border-black/5 dark:border-white/5">
                    <div className="text-[10px] text-gray-600 font-black uppercase mb-1">2 Hours Ago</div>
                    <div className="text-gray-900 dark:text-white text-xs font-bold">Library hours extended for finals.</div>
                 </div>
                 <div className="p-4 bg-black/5 dark:bg-white/5 rounded-xl border border-black/5 dark:border-white/5 opacity-50">
                    <div className="text-[10px] text-gray-600 font-black uppercase mb-1">Yesterday</div>
                    <div className="text-gray-900 dark:text-white text-xs font-bold">Welcome to the new Quad Portal!</div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
