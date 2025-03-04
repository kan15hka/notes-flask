import { createContext, useContext, useEffect, useState } from "react";
import {
  removeUserFromLocalStorage,
  setUserToLocalStorage,
} from "../helper/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const loadUser = (userData) => {
    setUserToLocalStorage(userData);
    setUser(userData);
  };

  const removeUser = () => {
    removeUserFromLocalStorage();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loadUser, removeUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
