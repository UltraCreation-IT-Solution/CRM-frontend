'use client';

import { createContext, useContext, useState } from 'react';

// Create contexts
const CRMContext = createContext();
const AuthContext = createContext();

// CRM Provider
function CRMProvider({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notifications, setNotifications] = useState([
    { id: 1, message: 'New lead assigned', type: 'info' },
    { id: 2, message: 'Deal closed successfully', type: 'success' },
    { id: 3, message: 'Follow-up required', type: 'warning' },
  ]);

  const value = {
    sidebarOpen,
    setSidebarOpen,
    notifications,
    setNotifications,
  };

  return <CRMContext.Provider value={value}>{children}</CRMContext.Provider>;
}

// Auth Provider
function AuthProvider({ children }) {
  const [user, setUser] = useState({
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    role: 'Sales Manager',
    avatar: '/default-avatar.png',
  });
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    user,
    isAuthenticated,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Combined Providers Component - DEFAULT EXPORT
export default function Providers({ children }) {
  return (
    <AuthProvider>
      <CRMProvider>{children}</CRMProvider>
    </AuthProvider>
  );
}

// Custom hooks
export function useCRM() {
  const context = useContext(CRMContext);
  if (context === undefined) {
    throw new Error('useCRM must be used within a CRMProvider');
  }
  return context;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
