import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Loader2 } from 'lucide-react';
import { useRsvpToEventMutation, useCancelRsvpMutation } from '../../services/eventApi';

interface RSVPButtonProps {
  eventId: string;
  initialIsRsvpd: boolean;
  className?: string;
  onSuccess?: () => void;
}

export const RSVPButton: React.FC<RSVPButtonProps> = ({ eventId, initialIsRsvpd, className = '', onSuccess }) => {
  const [rsvp] = useRsvpToEventMutation();
  const [cancelRsvp] = useCancelRsvpMutation();
  const [isRsvpd, setIsRsvpd] = useState(initialIsRsvpd);
  const [isLoading, setIsLoading] = useState(false);

  const handleAction = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      if (isRsvpd) {
        await cancelRsvp(eventId).unwrap();
        setIsRsvpd(false);
      } else {
        await rsvp(eventId).unwrap();
        setIsRsvpd(true);
      }
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('RSVP action failed:', error);
      // Optional: Add toast notification for failure
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleAction}
      disabled={isLoading}
      className={`relative overflow-hidden group font-semibold rounded-xl flex items-center justify-center transition-all duration-300 ${
        isRsvpd
          ? 'bg-gray-50 dark:bg-gray-800 hover:bg-red-500/10 text-gray-900 dark:text-white border border-gray-700 hover:border-red-500/50'
          : 'bg-indigo-600 hover:bg-indigo-500 text-gray-900 dark:text-white shadow-[0_0_20px_rgba(79,70,229,0.3)]'
      } ${className}`}
    >
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center bg-inherit"
          >
            <Loader2 className="w-5 h-5 animate-spin" />
          </motion.div>
        ) : isRsvpd ? (
          <motion.div
            key="rsvpd"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center"
          >
            {/* Show Check by default, but show X on hover */}
            <span className="flex items-center group-hover:hidden">
              <Check className="w-5 h-5 mr-2 text-green-400" />
              RSVP Confirmed
            </span>
            <span className="hidden items-center group-hover:flex text-red-400">
              <X className="w-5 h-5 mr-2" />
              Cancel RSVP
            </span>
          </motion.div>
        ) : (
          <motion.div
            key="rsvp"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center"
          >
            RSVP Now
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
};
