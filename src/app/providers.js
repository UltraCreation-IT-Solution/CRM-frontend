'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState, createContext, useContext, useEffect } from 'react';
import { io } from 'socket.io-client';

// Create contexts
const AuthContext = createContext();
const SocketContext = createContext();
const CRMContext = createContext();

// Query Client configuration
const createQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute
        cacheTime: 10 * 60 * 1000, // 10 minutes
        retry: (failureCount, error) => {
          // Don't retry on 401/403 errors
          if (error?.response?.status === 401 || error?.response?.status === 403) {
            return false;
          }
          return failureCount < 3;
        },
        refetchOnWindowFocus: false,
        refetchOnMount: true,
      },
      mutations: {
        retry: 1,
      },
    },
  });
};

// Auth Provider
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState(null);

  useEffect(() => {
    // Check for existing auth token on mount
    const savedToken = localStorage.getItem('crm_token');
    const savedUser = localStorage.getItem('crm_user');
    
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      
      localStorage.setItem('crm_token', data.access);
      localStorage.setItem('crm_user', JSON.stringify(data.user));
      
      setToken(data.access);
      setUser(data.user);
      
      return { success: true, user: data.user };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('crm_token');
    localStorage.removeItem('crm_user');
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Socket Provider
export function SocketProvider({ children }) {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const { token } = useAuth();

  useEffect(() => {
    if (token && process.env.NEXT_PUBLIC_WS_URL) {
      const newSocket = io(process.env.NEXT_PUBLIC_WS_URL, {
        auth: {
          token: token,
        },
        transports: ['websocket', 'polling'],
      });

      newSocket.on('connect', () => {
        console.log('Socket connected');
        setIsConnected(true);
        // Hide connection status indicator
        const statusEl = document.getElementById('connection-status');
        if (statusEl) statusEl.classList.add('hidden');
      });

      newSocket.on('disconnect', () => {
        console.log('Socket disconnected');
        setIsConnected(false);
        // Show connection status indicator
        const statusEl = document.getElementById('connection-status');
        if (statusEl) statusEl.classList.remove('hidden');
      });

      newSocket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
        setIsConnected(false);
      });

      // CRM-specific event listeners
      newSocket.on('lead_created', (data) => {
        console.log('New lead created:', data);
        // Handle new lead notification
      });

      newSocket.on('deal_updated', (data) => {
        console.log('Deal updated:', data);
        // Handle deal update notification
      });

      newSocket.on('activity_reminder', (data) => {
        console.log('Activity reminder:', data);
        // Handle activity reminder
      });

      newSocket.on('ticket_assigned', (data) => {
        console.log('Ticket assigned:', data);
        // Handle ticket assignment notification
      });

      setSocket(newSocket);

      return () => {
        newSocket.disconnect();
      };
    }
  }, [token]);

  const value = {
    socket,
    isConnected,
    emit: (event, data) => socket?.emit(event, data),
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
}

// CRM Context Provider
export function CRMProvider({ children }) {
  const [selectedContact, setSelectedContact] = useState(null);
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [currentPipeline, setCurrentPipeline] = useState('default');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notifications, setNotifications] = useState([]);

  // Notification management
  const addNotification = (notification) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { ...notification, id }]);
    
    // Auto-remove notification after 5 seconds
    setTimeout(() => {
      removeNotification(id);
    }, 5000);
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // MCP Server integration
  const callMCPServer = async (method, params = {}) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_MCP_SERVER_URL}/jsonrpc`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: Date.now(),
          method,
          params,
        }),
      });

      if (!response.ok) {
        throw new Error('MCP Server request failed');
      }

      const data = await response.json();
      return data.result;
    } catch (error) {
      console.error('MCP Server error:', error);
      throw error;
    }
  };

  const value = {
    // Selection state
    selectedContact,
    setSelectedContact,
    selectedDeal,
    setSelectedDeal,
    currentPipeline,
    setCurrentPipeline,
    
    // UI state
    sidebarOpen,
    setSidebarOpen,
    
    // Notifications
    notifications,
    addNotification,
    removeNotification,
    
    // MCP Server integration
    callMCPServer,
  };

  return (
    <CRMContext.Provider value={value}>
      {children}
    </CRMContext.Provider>
  );
}

// Main Providers component
export function Providers({ children }) {
  const [queryClient] = useState(() => createQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SocketProvider>
          <CRMProvider>
            {children}
            {process.env.NODE_ENV === 'development' && (
              <ReactQueryDevtools initialIsOpen={false} />
            )}
          </CRMProvider>
        </SocketProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

// Custom hooks for using contexts
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const useCRM = () => {
  const context = useContext(CRMContext);
  if (!context) {
    throw new Error('useCRM must be used within a CRMProvider');
  }
  return context;
};