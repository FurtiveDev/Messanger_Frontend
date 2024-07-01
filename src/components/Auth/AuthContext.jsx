import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('isAuthenticated') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('isAuthenticated', isAuthenticated);
  }, [isAuthenticated]);

  const authenticate = (status) => {
    setIsAuthenticated(status);
    localStorage.setItem('isAuthenticated', status);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated: authenticate }}>
      {children}
    </AuthContext.Provider>
  );
};
