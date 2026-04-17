import React, { useState, useEffect, useRef } from 'react';
import { IMessage, IConversation } from '../../types/chat';
import { Send, Phone, Video, Info, MoreVertical, Paperclip, Smile } from 'lucide-react';

interface MessageWindowProps {
  conversation: IConversation | null;
  messages: IMessage[];
  onSendMessage: (content: string) => void;
  currentUserId: string;
  roomType: 'event' | 'club' | 'project' | 'direct';
  title?: string;
  subtitle?: string;
  avatar?: string;
}

export const MessageWindow: React.FC<MessageWindowProps> = ({
  conversation,
  messages,
  onSendMessage,
  currentUserId,
  roomType,
  title,
  subtitle,
  avatar
}) => {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    onSendMessage(inputValue.trim());
    setInputValue('');
  };

  const otherUser = conversation?.participants.find(p => p._id !== currentUserId);
  const displayTitle = title || otherUser?.name || 'Chat';
  const displaySubtitle = subtitle || (roomType === 'direct' ? otherUser?.major || 'Student' : 'Group Chat');
  const displayAvatar = avatar || otherUser?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayTitle)}`;

  return (
    <div className="flex flex-col h-full bg-gray-950">
      {/* Header */}
      <div className="p-4 border-b border-gray-800 bg-gray-900/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img 
            src={displayAvatar} 
            alt={displayTitle} 
            className="w-10 h-10 rounded-full object-cover border border-gray-700"
          />
          <div>
            <h3 className="font-bold text-white text-sm">{displayTitle}</h3>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">{displaySubtitle}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button className="p-2 text-gray-500 hover:text-white transition-colors">
            <Phone size={18} />
          </button>
          <button className="p-2 text-gray-500 hover:text-white transition-colors">
            <Video size={18} />
          </button>
          <button className="p-2 text-gray-500 hover:text-white transition-colors">
            <Info size={18} />
          </button>
          <button className="p-2 text-gray-500 hover:text-white transition-colors">
            <MoreVertical size={18} />
          </button>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center">
             <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mb-4 border border-gray-800">
                <Smile className="text-gray-600" size={32} />
             </div>
             <h4 className="text-white font-bold">No messages here yet</h4>
             <p className="text-gray-500 text-sm max-w-xs">Start the conversation by sending a friendly "Hello!"</p>
          </div>
        ) : (
          messages.map((msg, i) => {
            const isMe = msg.sender._id === currentUserId;
            const showAvatar = i === 0 || messages[i-1].sender._id !== msg.sender._id;
            
            return (
              <div key={msg._id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                {!isMe && (
                  <div className="w-8 shrink-0">
                    {showAvatar && (
                      <img 
                        src={msg.sender.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(msg.sender.name)}`} 
                        alt={msg.sender.name}
                        className="w-8 h-8 rounded-full object-cover border border-gray-800"
                      />
                    )}
                  </div>
                )}
                
                <div className={`max-w-[70%] ${isMe ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                  {showAvatar && (
                    <span className="text-[10px] font-bold text-gray-500 px-1">
                      {isMe ? 'You' : msg.sender.name} • {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  )}
                  <div className={`
                    px-4 py-2.5 rounded-2xl text-sm leading-relaxed
                    ${isMe 
                      ? 'bg-indigo-600 text-white rounded-tr-none shadow-lg shadow-indigo-600/10' 
                      : 'bg-gray-800 text-gray-200 rounded-tl-none border border-gray-700'}
                  `}>
                    {msg.content}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="p-4 bg-gray-900/50 border-t border-gray-800">
        <form onSubmit={handleSubmit} className="flex items-center gap-3">
          <button type="button" className="p-2 text-gray-500 hover:text-white transition-colors">
            <Paperclip size={20} />
          </button>
          
          <div className="flex-1 relative">
            <input 
              type="text" 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your message..." 
              className="w-full bg-gray-950 border border-gray-800 rounded-2xl py-3 px-5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all shadow-inner"
            />
            <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors">
              <Smile size={20} />
            </button>
          </div>
          
          <button 
            type="submit" 
            disabled={!inputValue.trim()}
            className="p-3 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20 disabled:opacity-50 disabled:shadow-none"
          >
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};
