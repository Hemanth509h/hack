import React, { useState, useEffect, useRef } from "react";
import { useSocket } from "../../context/SocketContext";
import { useSelector } from "react-redux";
import { useGetMessageHistoryQuery } from "../../services/chatApi";
import { MessageBubble } from "./MessageBubble";
import { Send, Smile } from "lucide-react";
import cn from "clsx";

export const ChatWindow = ({ roomType, roomId, title }) => {
  const { data, isLoading } = useGetMessageHistoryQuery({ roomType, roomId });
  const { socket, isConnected } = useSocket();
  const currentUser = useSelector((state) => state.auth.user);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (data?.messages) {
      setMessages(data.messages);
    }
  }, [data]);

  useEffect(() => {
    if (!socket || !isConnected) return;

    // Join room
    socket.emit("join_room", { roomType, roomId });

    socket.on("message:new", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on("typing:start", (data) => {
      if (data.name !== currentUser?.name) {
        setIsTyping(data);
      }
    });

    socket.on("typing:stop", () => {
      setIsTyping(null);
    });

    return () => {
      socket.emit("leave_room", { roomType, roomId });
      socket.off("message:new");
      socket.off("typing:start");
      socket.off("typing:stop");
    };
  }, [socket, isConnected, roomType, roomId, currentUser]);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim() || !socket || !currentUser) return;
    // Optimistic UI for my message
    // Usually wait for server, but we just send and let server bounce back the message:new event.
    socket.emit("message:send", {
      roomType,
      roomId,
      content: inputText,
    });
    setInputText("");
    socket.emit("typing:stop", { roomType, roomId });
  };

  const handleTyping = (e) => {
    setInputText(e.target.value);
    if (!socket) return;
    if (e.target.value) {
      socket.emit("typing:start", {
        roomType,
        roomId,
        name: currentUser?.name,
      });
    } else {
      socket.emit("typing:stop", { roomType, roomId });
    }
  };

  return (
    <div className="flex flex-col h-full min-h-[500px] w-full bg-gray-100 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 shadow-2xl rounded-xl overflow-hidden relative">
      <div className="p-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex justify-between items-center z-10 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {title} Chat
        </h3>
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "w-2.5 h-2.5 rounded-full",
              isConnected ? "bg-green-500 animate-pulse" : "bg-red-500",
            )}
          ></span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col justify-end">
        <div className="flex flex-col gap-2">
          {isLoading ? (
            <div className="text-center text-gray-500 py-4">
              Loading messages...
            </div>
          ) : (
            messages.map((m) => (
              <MessageBubble
                key={m._id || Math.random().toString()}
                message={m}
                currentUser={currentUser}
              />
            ))
          )}

          {isTyping && (
            <div className="text-xs text-gray-600 dark:text-gray-400 italic mt-2 ml-2 transition-all">
              {isTyping.name} is typing...
            </div>
          )}
          <div ref={bottomRef} className="h-2" />
        </div>
      </div>

      <div className="p-3 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
        <form onSubmit={handleSend} className="flex items-center gap-2">
          <button
            type="button"
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:text-gray-300 transition-colors"
          >
            <Smile className="w-5 h-5" />
          </button>
          <input
            type="text"
            value={inputText}
            onChange={handleTyping}
            placeholder="Type a message..."
            className="flex-1 bg-gray-50 dark:bg-gray-800 border border-gray-700 text-gray-900 dark:text-white placeholder-gray-500 rounded-full py-2 px-4 focus:outline-none focus:ring-1 focus:ring-primary-500 transition-all text-sm"
          />

          <button
            type="submit"
            disabled={!inputText.trim()}
            className="p-2 bg-primary-600 hover:bg-primary-500 text-gray-900 dark:text-white rounded-full disabled:opacity-50 transition-colors shadow-lg"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
