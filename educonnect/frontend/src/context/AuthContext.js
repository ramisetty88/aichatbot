import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const u = localStorage.getItem('ec_user');
      return u ? JSON.parse(u) : null;
    } catch { return null; }
  });
  const [role, setRole] = useState(() => localStorage.getItem('ec_role') || null);

  const login = (token, userData, userRole) => {
    localStorage.setItem('ec_token', token);
    localStorage.setItem('ec_user', JSON.stringify(userData));
    localStorage.setItem('ec_role', userRole);
    setUser(userData);
    setRole(userRole);
  };

  const logout = () => {
    localStorage.removeItem('ec_token');
    localStorage.removeItem('ec_user');
    localStorage.removeItem('ec_role');
    setUser(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ user, role, login, logout, isAdmin: role === 'admin', isParent: role === 'parent' }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
