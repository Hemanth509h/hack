import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import {
  incrementUnread,
  addToast,
} from "../features/notifications/notificationSlice";

const SocketContext = createContext(undefined);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context)
    throw new Error("useSocket must be used within a SocketProvider");
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    if (!token) return;

    const socketInstance = io(
      import.meta.env.VITE_WS_URL || "http://localhost:5000",
      {
        auth: { token },
        transports: ["websocket"],
      },
    );

    socketInstance.on("connect", () => setIsConnected(true));
    socketInstance.on("disconnect", () => setIsConnected(false));

    // Listen for new notifications and update Redux Store
    socketInstance.on("notification:new", (data) => {
      dispatch(incrementUnread());
      dispatch(
        addToast({
          type: "info",
          title: data.title,
          message: data.message,
        }),
      );
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [token, dispatch]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};
