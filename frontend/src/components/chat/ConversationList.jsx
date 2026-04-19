import React from 'react';
import { Search } from 'lucide-react';



export const ConversationList = ({ 
  conversations, 
  activeId, 
  onSelect,
  currentUserId
}) => {
  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800">
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Messages</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
          <input 
            type="text" 
            placeholder="Search conversations..." 
            className="w-full bg-gray-100 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl py-2 pl-10 pr-4 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
          />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {conversations.length === 0 ? (
          <div className="p-8 text-center text-gray-500 text-sm">
            No conversations yet. Start chatting with students from the community
          </div>
        ) : (
          conversations.map((conv) => {
            const otherUser = conv.participants.find(p => p._id !== currentUserId);
            const isActive = activeId === conv._id;
            
            return (
              <button 
                key={conv._id}
                onClick={() => onSelect(conv._id)}
                className={`w-full flex items-center gap-3 p-4 hover:bg-gray-800/50 transition-all border-b border-gray-200 dark:border-gray-800/50 ${
                  isActive ? 'bg-indigo-600/10 border-r-2 border-r-indigo-500' : ''
                }`}
              >
                <div className="relative shrink-0">
                  <img 
                    src={otherUser?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(otherUser?.name || 'User')}`} 
                    alt={otherUser?.name} 
                    className="w-12 h-12 rounded-full object-cover border border-gray-700"
                  />
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-gray-900 rounded-full" />
                </div>
                
                <div className="flex-1 text-left min-w-0">
                  <div className="flex justify-between items-baseline mb-0.5">
                    <h3 className={`font-bold text-sm truncate ${isActive ? 'text-indigo-400' : 'text-gray-900 dark:text-white'}`}>
                      {otherUser?.name}
                    </h3>
                    <span className="text-[10px] text-gray-500 shrink-0">
                      {conv.lastMessage ? new Date(conv.lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 truncate">
                    {conv.lastMessage ? (
                      <>
                        {conv.lastMessage.sender._id === currentUserId ? 'You: ' : ''}
                        {conv.lastMessage.content}
                      </>
                    ) : (
                      <span className="italic">No messages yet</span>
                    )}
                  </p>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};
