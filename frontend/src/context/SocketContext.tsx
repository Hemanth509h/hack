import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  unreadCount: number;
  notifications: any[];
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) throw new Error('useSocket must be used within a SocketProvider');
  return context;
};

export const SocketProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    // In a real app, you'd get the token from your auth state/localStorage
    const token = localStorage.getItem('token');
    if (!token) return;

    const socketInstance = io(import.meta.env.VITE_WS_URL || 'http://localhost:5000', {
      auth: { token },
      transports: ['websocket'],
    });

    socketInstance.on('connect', () => setIsConnected(true));
    socketInstance.on('disconnect', () => setIsConnected(false));

    // Listen for new notifications and update badge
    socketInstance.on('notification:new', (data) => {
      setNotifications((prev) => [data, ...prev]);
      if (data.unreadCount !== undefined) {
        setUnreadCount(data.unreadCount);
      } else {
        setUnreadCount((prev) => prev + 1);
      }
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isConnected, unreadCount, notifications }}>
      {children}
    </SocketContext.Provider>
  );
};
