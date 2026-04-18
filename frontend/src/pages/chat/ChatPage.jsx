import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useGetConversationsQuery, useGetMessageHistoryQuery } from '../../services/chatApi';
import { useSocket } from '../../hooks/useSocket';
import { ConversationList } from '../../components/chat/ConversationList';
import { MessageWindow } from '../../components/chat/MessageWindow';
import { IMessage } from '../../types/chat';
import { Loader2, MessageSquare } from 'lucide-react';

const ChatPage: React.FC = () => {
  const currentUser = useSelector((state) => state.auth.user);
  const { data: convData, isLoading: convLoading, refetch: refetchConvs } = useGetConversationsQuery();
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [messages, setMessages] = useState([]);
  const { socket } = useSocket();

  const { data: historyData } = useGetMessageHistoryQuery(
    { roomType: 'direct', roomId: activeConvId! },
    { skip: !activeConvId }
  );

  useEffect(() => {
    if (historyData?.messages) {
      setMessages(historyData.messages);
    }
  }, [historyData]);

  useEffect(() => {
    if (!socket || !activeConvId) return;

    socket.emit('room:join', { type: 'direct', id: activeConvId });

    const handleNewMessage = (message) => {
      if (message.roomId === activeConvId) {
        setMessages((prev) => [...prev, message]);
      }
      refetchConvs();
    };

    socket.on('chat:message', handleNewMessage);

    return () => {
      socket.off('chat:message', handleNewMessage);
      socket.emit('room:leave', { type: 'direct', id: activeConvId });
    };
  }, [socket, activeConvId, refetchConvs]);

  const handleSendMessage = (content) => {
    if (!socket || !activeConvId) return;
    socket.emit('chat:send', {
      roomType: 'direct',
      roomId: activeConvId,
      content,
    });
  };

  const activeConv = convData?.conversations.find(c => c._id === activeConvId) || null;

  if (convLoading) {
    return (
      <div className="flex h-[calc(100vh-80px)] items-center justify-center">
        <Loader2 className="animate-spin text-indigo-500" size={40} />
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden">
      <div className="w-full md:w-80 lg:w-96 shrink-0 h-full">
        <ConversationList 
          conversations={convData?.conversations || []} 
          activeId={activeConvId} 
          onSelect={setActiveConvId}
          currentUserId={currentUser?.id || ''}
        />
      </div>
      
      <div className="flex-1 h-full hidden md:block">
        {activeConvId ? (
          <MessageWindow 
            conversation={activeConv}
            messages={messages}
            onSendMessage={handleSendMessage}
            currentUserId={currentUser?.id || ''}
            roomType="direct"
          />
        ) : (
          <div className="h-full flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-950 text-center p-8">
             <div className="w-20 h-20 bg-white dark:bg-gray-900 rounded-[2rem] flex items-center justify-center mb-6 border border-gray-200 dark:border-gray-800 shadow-2xl">
                <MessageSquare className="text-indigo-500" size={32} />
             </div>
             <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2">Select a Conversation</h2>
             <p className="text-gray-500 max-w-sm">Choose someone from your list or start a new chat from their profile to begin collaborating.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
