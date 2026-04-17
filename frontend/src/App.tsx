import { useState, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import SearchOverlay from './components/search/SearchOverlay'
import { SocketProvider } from './context/SocketContext'
import { motion, AnimatePresence } from 'framer-motion'
import { ChatWidget } from './components/chat/ChatWidget'
import { initAnalytics, trackPageView } from './lib/analytics'
import CookieBanner from './components/shared/CookieBanner'

function App() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/discover' || location.pathname === '/';

  // Keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
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
      <div className="min-h-screen bg-gray-950 text-gray-100 font-sans selection:bg-blue-500/30 w-full overflow-x-hidden">
        {/* Background Gradients */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-900/20 blur-[120px] rounded-full" />
          <div className="absolute bottom-[10%] right-[-5%] w-[35%] h-[35%] bg-purple-900/15 blur-[100px] rounded-full" />
        </div>

        <Navbar onSearchClick={() => setIsSearchOpen(true)} />
        
        <main className="pt-32 min-h-screen">
          {/* Hero / Header Section - Only show on Home/Discover page */}
          <AnimatePresence>
            {isHome && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="max-w-7xl mx-auto px-4 mb-12 text-center"
              >
                 <motion.h1 
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   className="text-5xl md:text-7xl font-black mb-6 tracking-tighter"
                 >
                   Explore Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">Campus.</span>
                 </motion.h1>
                 <motion.p 
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: 0.1 }}
                   className="text-gray-400 text-lg max-w-2xl mx-auto"
                 >
                   The unified platform for events, clubs, and collaborative projects at The Quad. Stay connected with real-time updates.
                 </motion.p>
              </motion.div>
            )}
          </AnimatePresence>

          <Outlet />
        </main>

        <SearchOverlay 
          isOpen={isSearchOpen} 
          onClose={() => setIsSearchOpen(false)} 
        />

        {/* Footer */}
        <footer className="py-12 border-t border-white/5 text-center text-gray-600 text-sm">
          <p>© 2026 The Quad • Engineered for Student Excellence</p>
        </footer>

        <ChatWidget />
        <CookieBanner />
      </div>
    </SocketProvider>
  )
}

export default App
