import { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Mic, Sparkles, CalendarPlus } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { toggleChat, addMessage, setTyping } from '../../features/chat/chatSlice';

export const ChatWidget = () => {
  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.chat.isOpen);
  const messages = useSelector((state) => state.chat.messages);
  const isTyping = useSelector((state) => state.chat.isTyping);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen, isTyping]);

  const handleSend = () => {
    if (!inputText.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: inputText.trim(),
      timestamp: new Date().toISOString()
    };
    
    dispatch(addMessage(userMessage));
    setInputText('');
    dispatch(setTyping(true));

    // MOCK RESPONSE
    setTimeout(() => {
      dispatch(setTyping(false));
      dispatch(addMessage({
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: `I can help with that. Here is some information about your query. \n\n* Campus Map \n* Event Directory \n* Connect with Clubs`,
        timestamp: new Date().toISOString()
      }));
    }, 1500);
  };

  const handleKeyPress = ( e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestionClick = (question) => {
    setInputText(question);
    // Could auto-send here too
  };

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
           <motion.div 
             initial={{ scale: 0, opacity: 0 }}
             animate={{ scale: 1, opacity: 1 }}
             exit={{ scale: 0, opacity: 0 }}
             className="fixed bottom-6 right-6 z-[100]"
           >
             <button 
               onClick={() => dispatch(toggleChat())}
               className="w-14 h-14 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-gray-900 dark:text-white flex items-center justify-center shadow-lg shadow-purple-500/30 hover:scale-105 transition-transform group relative"
             >
                <Sparkles size={24} className="group-hover:animate-pulse" />
                {/* Notification Badge */}
                <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-red-500 border-2 border-gray-900 rounded-full"></span>
             </button>
           </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ type: "spring", bounce: 0.25 }}
            className="fixed bottom-6 right-6 z-[100] w-[380px] h-[600px] max-h-[80vh] flex flex-col bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="h-16 bg-gradient-to-r from-purple-900/40 to-blue-900/40 border-b border-gray-200 dark:border-gray-800 flex flex-row justify-between items-center px-4">
               <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center shadow-inner">
                    <Sparkles size={16} className="text-gray-900 dark:text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                      Nexus <span className="text-[10px] uppercase font-bold tracking-wider bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded">AI Bot</span>
                    </h3>
                  </div>
               </div>
               <button 
                 onClick={() => dispatch(toggleChat())}
                 className="p-1.5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:text-white hover:bg-gray-800 rounded-lg transition"
               >
                 <X size={20} />
               </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
              {messages.map((msg) => (
                 <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                   {msg.sender === 'bot' && (
                     <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center mt-1 mr-2 flex-shrink-0">
                       <Sparkles size={12} className="text-gray-900 dark:text-white" />
                     </div>
                   )}
                   <div 
                     className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                       msg.sender === 'user' 
                         ? 'bg-blue-600 text-gray-900 dark:text-white rounded-tr-sm' 
                         : 'bg-gray-50 dark:bg-gray-800 text-gray-200 border border-gray-700 rounded-tl-sm'
                     }`}
                   >
                     {msg.sender === 'bot' ? (
                       <div className="prose prose-invert prose-p:leading-relaxed prose-pre:bg-gray-900 prose-sm max-w-none">
                         <ReactMarkdown remarkPlugins={[remarkGfm]}>
                           {msg.text}
                         </ReactMarkdown>
                         {msg.richContent && (
                            <div className="mt-3 bg-white dark:bg-gray-900 p-3 rounded-lg border border-gray-700 text-xs flex justify-between items-center">
                              <div>
                                <p className="font-semibold text-gray-800 dark:text-gray-100">{msg.richContent.title || 'Event Details'}</p>
                                <p className="text-gray-600 dark:text-gray-400">{msg.richContent.subtitle || 'Information Card'}</p>
                              </div>
                              <button className="bg-blue-600/20 text-blue-400 p-1.5 rounded hover:bg-blue-600/40 transition">
                                <CalendarPlus size={14} />
                              </button>
                            </div>
                         )}
                       </div>
                     ) : (
                       msg.text
                     )}
                   </div>
                 </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center mt-1 mr-2 flex-shrink-0">
                    <Sparkles size={12} className="text-gray-900 dark:text-white" />
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 border border-gray-700 text-gray-600 dark:text-gray-400 rounded-2xl rounded-tl-sm px-4 py-3 flex gap-1.5 items-center">
                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.8 }} className="w-1.5 h-1.5 bg-gray-500 rounded-full" />
                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.15 }} className="w-1.5 h-1.5 bg-gray-500 rounded-full" />
                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.3 }} className="w-1.5 h-1.5 bg-gray-500 rounded-full" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-3 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
               {messages.length < 3 && !isTyping && (
                 <div className="flex gap-2 mb-3 overflow-x-auto pb-1 no-scrollbar">
                   {["Where is the Seminar Hall?", "Library hours today?", "Next basketball match?"].map((q, i) => (
                     <button
                       key={i}
                       onClick={() => handleSuggestionClick(q)}
                       className="whitespace-nowrap flex-shrink-0 px-3 py-1.5 bg-gray-50 dark:bg-gray-800 hover:bg-gray-700 text-xs text-gray-700 dark:text-gray-300 rounded-full border border-gray-700 transition"
                     >
                       {q}
                     </button>
                   ))}
                 </div>
               )}
               <div className="relative flex items-end gap-2 bg-gray-100 dark:bg-gray-950 p-2 rounded-xl border border-gray-700 focus-within:border-purple-500/50 transition-colors">
                  <button className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:text-white p-2">
                    <Mic size={18} />
                  </button>
                  <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Ask Nexus something..."
                    className="flex-1 max-h-32 min-h-10 bg-transparent text-sm text-gray-800 dark:text-gray-100 placeholder-gray-500 focus:outline-none resize-none py-2"
                    rows={1}
                  />
                  <button 
                    onClick={handleSend}
                    disabled={!inputText.trim()}
                    className="bg-blue-600 disabled:opacity-50 disabled:hover:scale-100 text-gray-900 dark:text-white p-2 rounded-lg hover:scale-105 transition-transform"
                  >
                    <Send size={16} />
                  </button>
               </div>
               <div className="text-center mt-2">
                 <p className="text-[10px] text-gray-500">Nexus AI can make mistakes. Consider verifying important information.</p>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
