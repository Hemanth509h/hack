import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, QrCode, Smartphone, RefreshCw } from 'lucide-react';
import { useGetQrCodeDataQuery } from '../../../services/eventApi';

interface QRCodeDisplayProps {
  eventId: string;
}

const QRCodeDisplay = ({ eventId }: QRCodeDisplayProps) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Use polling or manual refresh to ensure expiration limits
  const { data: qrPayload, isLoading, isError, refetch } = useGetQrCodeDataQuery(eventId, {
    skip: !isOpen
  });

  const handleOpen = () => {
    // Attempt to boost screen brightness if supported (Experimental web API)
    if ('wakeLock' in navigator) {
      navigator.wakeLock.request('screen').catch(() => {});
    }
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      <button 
        onClick={handleOpen}
        className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-xl font-bold shadow-lg shadow-purple-500/25 hover:scale-105 transition-all"
      >
        <QrCode size={20} />
        Show Check-In Code
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-950/90 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl overflow-hidden max-w-sm w-full relative shadow-2xl"
            >
              <div className="absolute top-4 right-4 z-10">
                <button 
                  onClick={handleClose}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300 transition"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="p-8 pb-4 text-center">
                <h3 className="text-2xl font-black text-gray-900 mb-1">Event Entry</h3>
                <p className="text-sm text-gray-500 mb-8">Have this ready at the door</p>
                
                <div className="bg-gray-100 p-4 rounded-3xl mx-auto w-fit mb-8 relative border-4 border-white shadow-inner">
                  {isLoading ? (
                    <div className="w-56 h-56 flex items-center justify-center text-gray-400 flex-col gap-3">
                       <RefreshCw className="animate-spin text-purple-500" size={32} />
                       Generating secure ticket...
                    </div>
                  ) : isError ? (
                    <div className="w-56 h-56 flex items-center justify-center text-red-500 text-sm font-semibold p-4 text-center">
                       Failed to load QR code. Please check your connection.
                    </div>
                  ) : qrPayload ? (
                    <QRCodeSVG 
                      value={JSON.stringify(qrPayload)}
                      size={224}
                      level="H"
                      includeMargin={false}
                      fgColor="#000000"
                      bgColor="#f3f4f6"
                    />
                  ) : null}
                </div>

                <div className="flex items-center justify-center gap-2 text-xs text-gray-400 font-medium bg-gray-50 p-3 rounded-xl border border-gray-100">
                   <Smartphone size={16} /> 
                   Maximum brightness recommended
                </div>
              </div>

              <div className="bg-gray-50 p-4 border-t border-gray-100 mt-2 flex justify-between items-center text-sm">
                 <span className="text-gray-500 font-medium">Valid for 24h</span>
                 <button onClick={() => refetch()} className="text-blue-600 font-bold hover:text-blue-700 flex flex-center gap-1.5 px-3 py-1.5 rounded hover:bg-blue-50 transition">
                   <RefreshCw size={14} /> Refresh
                 </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default QRCodeDisplay;
