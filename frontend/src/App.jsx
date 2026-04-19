import { useState, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import BottomNav from './components/layout/BottomNav'
import Sidebar from './components/layout/Sidebar'
import SearchOverlay from './components/search/SearchOverlay'
import { SocketProvider } from './context/SocketContext'
import { motion, AnimatePresence } from 'framer-motion'
import { ChatWidget } from './components/chat/ChatWidget'
import { initAnalytics, trackPageView } from './lib/analytics'
import CookieBanner from './components/shared/CookieBanner'
import { useNotifications } from './hooks/useNotifications'

function App() {
  useNotifications();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/discover' || location.pathname === '/';

  // Keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    // Check if GDPR cookie consent is dropped
    const hasConsented = document.cookie.includes('quad_tracking_consent=true');
    if (hasConsented) initAnalytics(true);
    
    trackPageView(location.pathname + location.search);
  }, [location.pathname, location.search]);

  return (
    <SocketProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-[#030303] text-gray-900 dark:text-gray-100 font-sans selection:bg-indigo-500/30 w-full overflow-x-hidden transition-colors duration-300">
        {/* Advanced Background Gradients */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-indigo-900/10 blur-[150px] rounded-full animate-float" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-900/10 blur-[130px] rounded-full" style={{ animation: 'float 8s ease-in-out infinite reverse' }} />
          <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-blue-900/5 blur-[100px] rounded-full animate-pulse" />
        </div>

        <div className="md:hidden">
          <Navbar onSearchClick={() => setIsSearchOpen(true)} />
        </div>
        
        <Sidebar onSearchClick={() => setIsSearchOpen(true)} />
        
        <main className="pt-24 md:pt-0 md:pl-64 min-h-screen relative z-10">
          {/* Hero / Header Section - Only show on Home/Discover page */}
          <AnimatePresence>
            {isHome && (
              <div className="w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 pt-16 md:pt-28">
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="mb-16 text-center md:text-left"
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="inline-block px-4 py-1.5 mb-6 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-widest"
                  >
                    Campus Intelligence Platform
                  </motion.div>
                  <motion.h1 
                    className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-8 tracking-tighter leading-[0.9] text-gray-900 dark:text-white"
                  >
                    Explore Your <br />
                    <span className="text-gradient">Campus.</span>
                  </motion.h1>
                  <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-gray-600 dark:text-gray-400 text-lg sm:text-xl md:text-2xl max-w-2xl md:mx-0 mx-auto font-light leading-relaxed"
                  >
                    The unified ecosystem for events, clubs, and collaborative projects. Stay ahead with real-time campus pulse.
                  </motion.p>
                  
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="mt-10 flex flex-wrap items-center justify-center md:justify-start gap-4"
                  >
                    <button className="btn-primary">Get Started</button>
                    <button className="btn-glass">View Events</button>
                  </motion.div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          <Outlet />
        </main>

        <SearchOverlay 
          isOpen={isSearchOpen} 
          onClose={() => setIsSearchOpen(false)} 
        />
        
        <BottomNav />

        {/* Footer */}
        <footer className="py-12 pb-24 md:pb-12 border-t border-black/5 dark:border-white/5 text-center text-gray-600 text-sm">
          <p>© 2026 The Quad • Engineered for Student Excellence</p>
        </footer>

        <ChatWidget />
        <CookieBanner />
      </div>
    </SocketProvider>
  );
}

export default App;
