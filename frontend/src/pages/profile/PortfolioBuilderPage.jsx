import React, { useState } from 'react';
import { ArrowLeft, Save, GripVertical, Image } from 'lucide-react';
import { Link } from 'react-router-dom';

const PortfolioBuilderPage = () => {
  const [sections, setSections] = useState([
    { id: '1', type: 'text', title: 'About My Work', content: 'In my free time...' },
    { id: '2', type: 'projects', title: 'Featured Projects', items: [] },
  ]);

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-8">
         <div>
            <Link to="/profile" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:text-white flex items-center gap-2 mb-2 text-sm transition-colors cursor-pointer">
              <ArrowLeft className="w-4 h-4" /> Back to Profile
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Portfolio Builder</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Design your portfolio landing page dynamically.</p>
         </div>
         <button className="flex items-center gap-2 bg-primary-600 hover:bg-primary-500 text-gray-900 dark:text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-lg cursor-pointer">
            <Save className="w-4 h-4" /> Publish
         </button>
      </div>

      <div className="space-y-4">
         {sections.map((sec, idx) => (
            <div key={sec.id} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 flex gap-4 pr-12 relative group hover:border-gray-700 transition-colors shadow-sm">
               <div className="cursor-grab active:cursor-grabbing text-gray-600 hover:text-gray-600 dark:text-gray-400 pt-1">
                 <GripVertical className="w-5 h-5" />
               </div>
               <div className="flex-1">
                 <input 
                   type="text" 
                   value={sec.title} 
                   onChange={(e) => {
                     const newSec = [...sections];
                     newSec[idx].title = e.target.value;
                     setSections(newSec);
                   }}
                   className="bg-transparent text-xl font-semibold text-gray-900 dark:text-white outline-none border-b border-transparent focus:border-gray-700 w-full pb-1 mb-4 transition-colors" 
                 />
                 
                 {sec.type === 'text' && (
                    <textarea 
                      className="w-full bg-gray-100 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg p-3 text-gray-700 dark:text-gray-300 min-h-[100px] outline-none focus:border-gray-700 focus:ring-1 focus:ring-primary-500 transition-all"
                      value={sec.content}
                      onChange={(e) => {
                        const newSec = [...sections];
                        newSec[idx].content = e.target.value;
                        setSections(newSec);
                      }}
                    />
                 )}
                 {sec.type === 'projects' && (
                    <div className="border border-dashed border-gray-700 rounded-lg p-10 flex flex-col items-center justify-center text-gray-500 bg-gray-100 dark:bg-gray-950/50 hover:bg-gray-900 hover:border-primary-500/50 hover:text-primary-400 transition-all cursor-pointer group/inner">
                       <Image className="w-8 h-8 mb-2 opacity-50 group-hover/inner:opacity-100 transition-opacity" />
                       <span className="font-medium text-sm">Add Project Card</span>
                    </div>
                 )}
               </div>
            </div>
         ))}
      </div>
      
      <button className="mt-6 w-full py-4 border-2 border-dashed border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 font-medium rounded-xl hover:border-gray-700 hover:text-gray-700 dark:text-gray-300 transition-colors cursor-pointer bg-white dark:bg-gray-900/30">
        + Add New Section
      </button>
    </div>
  );
};

export default PortfolioBuilderPage;
