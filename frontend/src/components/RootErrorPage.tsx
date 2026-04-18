import React from 'react';
import { useRouteError, isRouteErrorResponse, useNavigate } from 'react-router-dom';
import { AlertTriangle, Home, RotateCcw, ShieldAlert } from 'lucide-react';


const RootErrorPage: React.FC = () => {
  const error = useRouteError();
  const navigate = useNavigate();

  let errorMessage = "An unexpected error occurred.";
  let errorCode = "ERROR";

  if (isRouteErrorResponse(error)) {
    errorCode = error.status.toString();
    errorMessage = error.statusText || error.data?.message || errorMessage;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 flex items-center justify-center p-6 text-gray-800 dark:text-gray-100 font-sans">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-red-900/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[10%] right-[-5%] w-[35%] h-[35%] bg-blue-900/10 blur-[100px] rounded-full" />
      </div>

      <div className="max-w-md w-full text-center relative z-10">
        <div className="mb-8 flex justify-center">
          <div className="w-24 h-24 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center">
            <AlertTriangle size={48} className="text-red-500" />
          </div>
        </div>

        <h1 className="text-8xl font-black mb-4 tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-700">
          {errorCode}
        </h1>
        
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Oops! Something went wrong</h2>
        
        <p className="text-gray-600 dark:text-gray-400 mb-10 leading-relaxed bg-black/5 dark:bg-white/5 p-4 rounded-2xl border border-black/5 dark:border-white/5 font-mono text-sm break-words">
          {errorMessage}
        </p>

        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={() => window.location.reload()}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-gray-900 dark:text-white font-bold rounded-2xl border border-black/10 dark:border-white/10 transition-all"
          >
            <RotateCcw size={18} />
            Try Again
          </button>
          <button 
            onClick={() => navigate('/discover')}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-gray-900 dark:text-white font-bold rounded-2xl transition-all shadow-lg shadow-blue-500/20"
          >
            <Home size={18} />
            Go Home
          </button>
        </div>

        <div className="mt-12 flex items-center justify-center gap-2 text-gray-600 text-xs font-bold uppercase tracking-widest">
           <ShieldAlert size={14} />
           <span>System Status: Degraded</span>
        </div>
      </div>
    </div>
  );
};

export default RootErrorPage;
