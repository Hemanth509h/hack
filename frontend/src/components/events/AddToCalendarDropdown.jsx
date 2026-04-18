import { useState, useRef, useEffect } from 'react';
import { CalendarPlus, Download, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { IEvent } from '../../types/event';
import { buildGoogleCalendarUrl, buildOutlookCalendarUrl, getIcsDownloadUrl } from '../../lib/calendarUtils';



const AddToCalendarDropdown = ({ event }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const googleUrl = buildGoogleCalendarUrl(event);
  const outlookUrl = buildOutlookCalendarUrl(event);
  const icsUrl = getIcsDownloadUrl(event._id);

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl text-gray-200 text-sm font-semibold transition"
      >
        <CalendarPlus size={16} className="text-purple-400" />
        Add to Calendar
        <ChevronDown size={14} className={`text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-2xl overflow-hidden z-20"
          >
            <div className="p-1">
              <a 
                href={googleUrl} 
                target="_blank" 
                rel="noreferrer"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-800 hover:text-gray-900 dark:text-white rounded-lg transition"
              >
                <div className="w-6 h-6 rounded bg-white flex items-center justify-center p-0.5">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Google_Calendar_icon_%20%282020%29.svg" alt="Google Calendar" />
                </div>
                Google Calendar
              </a>
              <a 
                href={outlookUrl} 
                target="_blank" 
                rel="noreferrer"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-800 hover:text-gray-900 dark:text-white rounded-lg transition"
              >
                <div className="w-6 h-6 rounded bg-[#0072C6] flex items-center justify-center">
                  <span className="text-gray-900 dark:text-white font-bold text-xs">O</span>
                </div>
                Outlook / Office 365
              </a>
              <div className="h-px bg-gray-50 dark:bg-gray-800 my-1 mx-2" />
              <a 
                href={icsUrl} 
                download
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-800 hover:text-gray-900 dark:text-white rounded-lg transition"
              >
                <div className="w-6 h-6 rounded bg-gray-700 flex items-center justify-center text-gray-700 dark:text-gray-300">
                  <Download size={14} />
                </div>
                Download .ics
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AddToCalendarDropdown;
