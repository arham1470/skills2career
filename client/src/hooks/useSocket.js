import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

export const useSocket = (token) => {
  const socketRef = useRef(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!token) return;

    socketRef.current = io("http://localhost:5000", {
      auth: { token },
      transports: ["websocket"],
    });

    const socket = socketRef.current;

    socket.on("connect", () => setIsConnected(true));
    socket.on("disconnect", () => setIsConnected(false));
    socket.on("onlineUsers", (users) => setOnlineUsers(users));

    return () => {
      socket.disconnect();
    };
  }, [token]);

  return { socket: socketRef.current, onlineUsers, isConnected };
};