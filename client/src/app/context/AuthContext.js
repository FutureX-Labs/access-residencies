"use client";
import { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  useEffect(() => {
    // Check if localStorage is available (runs only in the browser)
    const storedAuth = localStorage.getItem("isAdminAuthenticated");
    if (storedAuth) {
      setIsAdminAuthenticated(JSON.parse(storedAuth));
    }
  }, []); // Empty dependency array ensures this effect runs only once

  const loginAdmin = () => {
    setIsAdminAuthenticated(true);
    localStorage.setItem("isAdminAuthenticated", JSON.stringify(true));
  };

  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
    localStorage.removeItem("isAdminAuthenticated");
  };

  return (
    <AuthContext.Provider
      value={{
        isAdminAuthenticated,
        loginAdmin,
        logoutAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
