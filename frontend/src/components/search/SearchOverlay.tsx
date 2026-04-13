import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Calendar, Users, History, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../lib/api';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchOverlay: React.FC<SearchOverlayProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{ events: any[], clubs: any[] }>({ events: [], clubs: [] });
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.length < 2) {
        setResults({ events: [], clubs: [] });
        return;
      }

      setIsLoading(true);
      try {
        const { data } = await api.get(`/search/autocomplete?q=${query}`);
        setResults(data);
      } catch (err) {
        console.error('Search failed', err);
      } finally {
        setIsLoading(false);
      }
    };

    const timeout = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timeout);
  }, [query]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-gray-950/80 backdrop-blur-md flex justify-center pt-24 px-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: -20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: -20 }}
            className="w-full max-w-2xl bg-gray-900/90 border border-white/10 rounded-3xl shadow-2xl overflow-hidden h-fit max-h-[70vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search Input Area */}
            <div className="p-6 border-b border-white/5 flex items-center space-x-4">
              <Search className="text-blue-500" size={24} />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search events, clubs, projects..."
                className="bg-transparent border-none outline-none flex-1 text-xl text-white placeholder-gray-500"
              />
              <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-gray-400 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Results Area */}
            <div className="overflow-y-auto p-4 custom-scrollbar">
              {!query && (
                <div className="py-8 text-center text-gray-500">
                  <History className="mx-auto mb-4 opacity-20" size={48} />
                  <p>Type to search the campus platform...</p>
                </div>
              )}

              {isLoading && (
                <div className="py-8 flex justify-center">
                  <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}

              {!isLoading && query.length >= 2 && (
                <div className="space-y-6">
                  {results.events.length > 0 && (
                    <div>
                      <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 px-2">Events</h3>
                      <div className="space-y-1">
                        {results.events.map((event: any) => (
                          <SearchResultItem key={event.id} icon={<Calendar size={18} />} title={event.text} subtitle={event.category} />
                        ))}
                      </div>
                    </div>
                  )}

                  {results.clubs.length > 0 && (
                    <div>
                      <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 px-2">Clubs</h3>
                      <div className="space-y-1">
                        {results.clubs.map((club: any) => (
                          <SearchResultItem key={club.id} icon={<Users size={18} />} title={club.text} subtitle={club.category} />
                        ))}
                      </div>
                    </div>
                  )}

                  {results.events.length === 0 && results.clubs.length === 0 && (
                    <div className="py-12 text-center text-gray-500">
                      <p>No matches found for "{query}"</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 bg-white/5 flex items-center justify-between text-[11px] text-gray-500">
              <div className="flex items-center space-x-4">
                <span className="flex items-center space-x-1">
                  <kbd className="px-1 bg-white/10 rounded h-4 border border-white/10 flex items-center">↵</kbd>
                  <span>to select</span>
                </span>
                <span className="flex items-center space-x-1">
                  <kbd className="px-1 bg-white/10 rounded h-4 border border-white/10 flex items-center">↑↓</kbd>
                  <span>to navigate</span>
                </span>
              </div>
              <span>Press <kbd className="px-1 bg-white/10 rounded h-4 border border-white/10">Esc</kbd> to close</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const SearchResultItem: React.FC<{ icon: React.ReactNode; title: string; subtitle?: string }> = ({ icon, title, subtitle }) => (
  <button className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-white/5 group transition-all text-left">
    <div className="flex items-center space-x-4">
      <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-gray-500 group-hover:text-blue-500 group-hover:bg-blue-500/10 transition-colors">
        {icon}
      </div>
      <div>
        <div className="text-sm font-semibold text-gray-200 group-hover:text-white transition-colors">{title}</div>
        {subtitle && <div className="text-xs text-gray-500">{subtitle}</div>}
      </div>
    </div>
    <ArrowRight size={16} className="text-gray-700 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
  </button>
);

export default SearchOverlay;
