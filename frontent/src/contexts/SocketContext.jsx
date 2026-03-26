import { createContext, useContext, useEffect, useRef } from "react";
import io from "socket.io-client";
import { useAuth } from "./AuthContext";

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const socket = useRef(null);
  const { token } = useAuth();

  useEffect(() => {
    if (!token) return;

    socket.current = io(import.meta.env.VITE_API_URL, {
      auth: { token },
    });

    socket.current.on("connect", () => console.log("Socket ulandi"));
    socket.current.on("error", (err) => console.error("Socket xato:", err));

    return () => socket.current?.disconnect();
  }, [token]);

  return (
    <SocketContext.Provider value={socket.current}>
      {children}
    </SocketContext.Provider>
  );
};
