import React from 'react';
import { ClubForm } from '../../components/clubs/ClubForm';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { Navigate, useNavigate } from 'react-router-dom';

export const CreateClubPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);

  if (user?.role !== 'admin') {
    return <Navigate to="/clubs" replace />;
  }

  return (
    <div className="min-h-screen pt-24 pb-20 px-6 max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <button 
          onClick={() => navigate('/clubs')}
          className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-gray-900 dark:text-white transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Directory
        </button>
        <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-indigo-600/10 text-indigo-400 mb-6">
          <Sparkles className="h-8 w-8" />
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4">
          Establish Your <span className="text-indigo-500">Legacy</span>
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
          The Quad is the heartbeat of campus life. Start a new club to bring like-minded individuals together and create something extraordinary.
        </p>
      </div>
      
      <ClubForm />
    </div>
  );
};

export default CreateClubPage;
