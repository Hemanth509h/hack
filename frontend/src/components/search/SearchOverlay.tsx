import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Calendar, Users, User, History, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { debounce } from 'lodash';
import { useNavigate } from 'react-router-dom';
import api from '../../lib/api';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchOverlay: React.FC<SearchOverlayProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{ events: any[], clubs: any[], users: any[] }>({ events: [], clubs: [], users: [] });
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && query.trim().length >= 2) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      onClose();
    }
  };

  const debouncedFetch = React.useMemo(
    () =>
      debounce(async (searchQuery: string) => {
        if (searchQuery.length < 2) {
          setResults({ events: [], clubs: [], users: [] });
          return;
        }

        setIsLoading(true);
        try {
          const { data } = await api.get(`/search/autocomplete?q=${searchQuery}`);
          // Mocking users for now as a Tier 1 addition
          setResults({ 
            events: data.events || [], 
            clubs: data.clubs || [], 
            users: data.users || [] 
          });
        } catch (err) {
          console.error('Search failed', err);
        } finally {
          setIsLoading(false);
        }
      }, 300),
    []
  );

  useEffect(() => {
    debouncedFetch(query);
    return () => debouncedFetch.cancel();
  }, [query, debouncedFetch]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-gray-50 dark:bg-[#030303]/90 backdrop-blur-2xl flex justify-center pt-32 px-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 40 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="w-full max-w-3xl glass rounded-[3rem] shadow-[0_50px_100px_rgba(0,0,0,0.8)] overflow-hidden h-fit max-h-[75vh] flex flex-col border-black/10 dark:border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search Input Area */}
            <div className="p-10 border-b border-black/5 dark:border-white/5 flex items-center space-x-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent animate-pulse" />
              <Search className="text-indigo-500" size={32} />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Synchronize with campus intelligence..."
                className="bg-transparent border-none outline-none flex-1 text-3xl font-display font-black text-gray-900 dark:text-white placeholder-gray-800"
              />
              <button onClick={onClose} className="p-4 glass bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 rounded-2xl text-gray-500 hover:text-gray-900 dark:text-white transition-all">
                <X size={24} />
              </button>
            </div>

            {/* Results Area */}
            <div className="overflow-y-auto p-10 custom-scrollbar">
              {!query && (
                <div className="py-20 text-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="mx-auto mb-10 w-24 h-24 rounded-full border border-indigo-500/20 flex items-center justify-center"
                  >
                    <History className="text-indigo-500/30" size={48} />
                  </motion.div>
                  <p className="text-gray-600 font-black uppercase tracking-[0.3em] text-xs">Waiting for Signal Input</p>
                </div>
              )}

              {isLoading && (
                <div className="py-20 flex flex-col items-center space-y-6">
                  <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
                  <p className="text-gray-600 font-black uppercase tracking-widest text-[10px]">Scanning Nexus...</p>
                </div>
              )}

              {!isLoading && query.length >= 2 && (
                <div className="space-y-12">
                  {results.events.length > 0 && (
                    <div>
                      <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-6 px-4">Live Events</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {results.events.map((event: any) => (
                          <SearchResultItem key={event.id} icon={<Calendar size={20} />} title={event.text} subtitle={event.category} path={`/events/${event.id}`} onClose={onClose} />
                        ))}
                      </div>
                    </div>
                  )}

                  {results.clubs.length > 0 && (
                    <div>
                      <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-6 px-4">Active Collectives</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {results.clubs.map((club: any) => (
                          <SearchResultItem key={club.id} icon={<Users size={20} />} title={club.text} subtitle={club.category} path={`/clubs/${club.id}`} onClose={onClose} />
                        ))}
                      </div>
                    </div>
                  )}

                  {results.users.length > 0 && (
                    <div>
                      <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-6 px-4">Student Dossiers</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {results.users.map((user: any) => (
                          <SearchResultItem key={user.id} icon={<User size={20} />} title={user.text} subtitle={user.major} path={`/profile/${user.id}`} onClose={onClose} />
                        ))}
                      </div>
                    </div>
                  )}

                  {results.events.length === 0 && results.clubs.length === 0 && results.users.length === 0 && (
                    <div className="py-20 text-center text-gray-600 font-bold">
                      <p className="text-2xl mb-2 tracking-tighter text-gray-900 dark:text-white">No Signal Found</p>
                      <p className="text-xs uppercase tracking-widest">Adjust frequency for "{query}"</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-8 glass bg-black/5 dark:bg-white/5 flex items-center justify-between">
              <div className="flex items-center space-x-8">
                <span className="flex items-center space-x-3 text-[10px] font-black text-gray-500 uppercase tracking-widest">
                  <kbd className="px-2 py-1 glass bg-black/10 dark:bg-white/10 rounded-lg border border-black/10 dark:border-white/10 text-gray-900 dark:text-white">ENTER</kbd>
                  <span>Select</span>
                </span>
                <span className="flex items-center space-x-3 text-[10px] font-black text-gray-500 uppercase tracking-widest">
                  <kbd className="px-2 py-1 glass bg-black/10 dark:bg-white/10 rounded-lg border border-black/10 dark:border-white/10 text-gray-900 dark:text-white">↑↓</kbd>
                  <span>Navigate</span>
                </span>
              </div>
              <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                System Signal: <span className="text-green-500">Active</span>
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const SearchResultItem: React.FC<{ icon: React.ReactNode; title: string; subtitle?: string; path: string; onClose: () => void }> = ({ icon, title, subtitle, path, onClose }) => {
  const navigate = useNavigate();
  return (
    <button 
      onClick={() => { navigate(path); onClose(); }}
      className="w-full flex items-center justify-between p-6 rounded-[2rem] glass bg-white/2 hover:bg-black/10 dark:hover:bg-white/10 border-black/5 dark:border-white/5 group transition-all text-left"
    >
      <div className="flex items-center space-x-6">
        <div className="w-14 h-14 glass bg-black/5 dark:bg-white/5 rounded-2xl flex items-center justify-center text-gray-500 group-hover:text-indigo-400 group-hover:bg-indigo-500/10 transition-all group-hover:scale-110">
          {icon}
        </div>
        <div>
          <div className="text-lg font-bold text-gray-900 dark:text-white tracking-tight leading-tight mb-1">{title}</div>
          {subtitle && <div className="text-[10px] font-black text-gray-600 uppercase tracking-widest">{subtitle}</div>}
        </div>
      </div>
      <ArrowRight size={20} className="text-gray-700 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all" />
    </button>
  );
};

export default SearchOverlay;
