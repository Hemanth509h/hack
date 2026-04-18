import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';



export default function AuthLayout({ children, title, subtitle }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 text-gray-800 dark:text-gray-100 font-sans selection:bg-blue-500/30 flex items-center justify-center p-4 relative overflow-hidden transition-colors duration-300">
      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className="absolute top-6 right-6 p-3 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-all duration-300 border border-black/5 dark:border-white/5 z-50 group"
        title="Toggle theme"
      >
        {theme === 'dark' ? (
          <Sun size={20} className="text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:text-white group-hover:rotate-90 transition-all" />
        ) : (
          <Moon size={20} className="text-gray-600 group-hover:text-gray-900 group-hover:-rotate-12 transition-all" />
        )}
      </button>

      {/* Background Gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-400/20 dark:bg-blue-900/30 blur-[120px] rounded-full" />
        <div className="absolute bottom-[10%] right-[-5%] w-[35%] h-[35%] bg-purple-400/20 dark:bg-purple-900/20 blur-[100px] rounded-full" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo / Brand */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <span className="text-3xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
              The Quad.
            </span>
          </Link>
          <h1 className="text-2xl font-bold mt-6 mb-2">{title}</h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm">{subtitle}</p>
        </div>

        {/* Auth Card Content */}
        <div className="bg-white/80 dark:bg-surface/50 backdrop-blur-xl border border-black/5 dark:border-white/5 p-8 rounded-2xl shadow-2xl">
          {children}
        </div>
      </motion.div>
    </div>
  );
}
