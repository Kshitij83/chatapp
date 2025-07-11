import { createContext, useContext } from "react";
import { useState } from "react";

export const AuthContext = createContext();

export const useAuthContext = () => {
  return useContext(AuthContext);
}

import React from "react";

export const AuthContextProvider = ({ children }) => {
  const [authUser, _setAuthUser] = useState(JSON.parse(localStorage.getItem("chat-user")) || null);

  // Custom setter to log changes
  const setAuthUser = (value) => {
    console.log("[AuthContext] setAuthUser called with:", value);
    _setAuthUser(value);
  };

  // Log whenever authUser changes
  React.useEffect(() => {
    console.log("[AuthContext] authUser changed:", authUser);
  }, [authUser]);

  return <AuthContext.Provider value={{authUser,setAuthUser}}>
    {children}
  </AuthContext.Provider>
}