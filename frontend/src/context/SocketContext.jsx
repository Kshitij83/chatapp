import { createContext, useEffect, useState, useContext } from "react";
import { useAuthContext } from "./AuthContext";
import io from "socket.io-client";

const SocketContext = createContext();

export const useSocketContext = () => {
  return useContext(SocketContext);
};

const BACKEND_URL =
  import.meta.env.VITE_SOCKET_URL ||
  (window.location.hostname === "localhost"
    ? "http://localhost:5000"
    : "https://chatapp-backend-40b2.onrender.com");

export const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const { authUser } = useAuthContext();

  useEffect(() => {
    if (authUser) {
      const socketInstance = io(BACKEND_URL, {
        query: {
          userId: authUser._id,
        },
        withCredentials: true,
      });

      setSocket(socketInstance);

      socketInstance.on("getOnlineUsers", (users) => {
        setOnlineUsers(users);
      });

      return () => socketInstance.close();
    } else {
      if (socket) {
        socket.close();
        setSocket(null);
      }
    }
    // eslint-disable-next-line
  }, [authUser]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};
