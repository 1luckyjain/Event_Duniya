import * as React from 'react';
import { STATUS } from '../utils/utils';
import axios from 'axios';

interface AuthState {
  user: any;
  token: string | null;
  expiresAt: string | null;
  isAuthenticated: boolean;
  status: string;
  verifyingToken: boolean;
}

const initialState: AuthState = {
  user: {},
  token: null,
  expiresAt: null,
  isAuthenticated: false,
  status: STATUS.PENDING,
  verifyingToken: false,
};

type AuthAction =
  | { type: 'login'; payload: { user: any; token: string; expiresAt: string } }
  | { type: 'logout' }
  | { type: 'updateUser'; payload: { user: any } }
  | { type: 'status'; payload: { status: string } }
  | { type: 'setVerifyingToken'; payload: { verifyingToken: boolean } };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'login': {
      return {
        user: action.payload.user,
        token: action.payload.token,
        expiresAt: action.payload.expiresAt,
        isAuthenticated: true,
        verifyingToken: false,
        status: STATUS.SUCCEEDED,
      };
    }
    case 'logout': {
      // Clear all localStorage items
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('expiresAt');
      localStorage.clear();
      
      return {
        ...initialState,
        status: STATUS.IDLE,
      };
    }
    case 'updateUser': {
      return {
        ...state,
        user: action.payload.user,
      };
    }
    case 'status': {
      return {
        ...state,
        status: action.payload.status,
      };
    }
    case 'setVerifyingToken': {
      return {
        ...state,
        verifyingToken: action.payload.verifyingToken,
      };
    }
    default: {
      throw new Error(`Unhandled action type`);
    }
  }
};

interface AuthContextType extends AuthState {
  login: (user: any, token: string, expiresAt: string) => void;
  logout: () => void;
  updateUser: (user: any) => void;
  setAuthenticationStatus: (status: string) => void;
  refreshToken: () => Promise<boolean>;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = React.useReducer(authReducer, initialState);
  const refreshTimeoutRef = React.useRef<NodeJS.Timeout>();
  // Add a lastRefreshAttempt ref to track when we last tried to refresh
  const lastRefreshAttempt = React.useRef<number>(0);
  // Add a minimum time between refresh attempts (5 seconds)
  const MIN_REFRESH_INTERVAL = 5000;

  const login = React.useCallback(
    (user: any, token: string, expiresAt: string) => {
      // Store auth data in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('expiresAt', expiresAt);

      dispatch({
        type: 'login',
        payload: {
          user,
          token,
          expiresAt,
        },
      });
    },
    []
  );

  const logout = React.useCallback(() => {
    dispatch({ type: 'logout' });
  }, []);

  const updateUser = React.useCallback((user: any) => {
    dispatch({
      type: 'updateUser',
      payload: { user },
    });
  }, []);

  const setAuthenticationStatus = React.useCallback((status: string) => {
    dispatch({
      type: 'status',
      payload: { status },
    });
  }, []);

  const refreshToken = React.useCallback(async (): Promise<boolean> => {
    if (state.verifyingToken) return false;
    
    // Check if we've tried to refresh too recently
    const now = Date.now();
    if (now - lastRefreshAttempt.current < MIN_REFRESH_INTERVAL) {
      console.log("Skipping refresh - attempted too recently");
      return false;
    }
    
    // Update the last refresh attempt timestamp
    lastRefreshAttempt.current = now;

    try {
      dispatch({ type: 'setVerifyingToken', payload: { verifyingToken: true } });

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/refresh`,
        {},
        { 
          withCredentials: true,
          timeout: 5000 // Add timeout to prevent long-hanging requests
        }
      );

      const { user: refreshedUser, accessToken, expiresAt: refreshedExpiresAt } = response.data;

      if (response.status === 204) {
        logout();
        return false;
      }

      login(refreshedUser, accessToken, refreshedExpiresAt);
      return true;
    } catch (error) {
      // Only logout on specific errors, not connection errors
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        logout();
      }
      return false;
    } finally {
      dispatch({ type: 'setVerifyingToken', payload: { verifyingToken: false } });
    }
  }, [login, logout, state.verifyingToken]);

  // Initialize auth state from localStorage only once
  React.useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      const expiresAt = localStorage.getItem('expiresAt');

      if (token && user && expiresAt) {
        const parsedUser = JSON.parse(user);
        const expiresAtDate = new Date(expiresAt).getTime();
        const now = Date.now();

        if (expiresAtDate > now) {
          // Token is still valid, use it
          login(parsedUser, token, expiresAt);
        } else {
          // Token is expired, try to refresh once
          const refreshed = await refreshToken();
          if (!refreshed) {
            logout();
          }
        }
      } else {
        logout();
      }
    };

    initializeAuth();
  }, [login, logout, refreshToken]);

  // Set up token refresh with improved logic to prevent loops
  React.useEffect(() => {
    // Clear any existing refresh timeout
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
      refreshTimeoutRef.current = undefined;
    }

    if (state.isAuthenticated && state.expiresAt) {
      const expiresAtDate = new Date(state.expiresAt).getTime();
      const now = Date.now();
      const timeUntilExpiry = expiresAtDate - now;

      // Only set up refresh if token expires in the future and is at least 10 seconds away
      if (timeUntilExpiry > 10000) {
        // Refresh when 90% of the token's lifetime has passed or 5 minutes before expiry, whichever is greater
        const timeToRefresh = Math.max(timeUntilExpiry * 0.1, Math.min(timeUntilExpiry - 300000, timeUntilExpiry * 0.9));
        
        console.log(`Token refresh scheduled in ${Math.floor(timeToRefresh/1000)} seconds`);
        
        refreshTimeoutRef.current = setTimeout(() => {
          refreshToken().catch(() => {
            console.log("Token refresh failed");
            // Don't automatically retry - next navigation will handle auth state
          });
        }, timeToRefresh);
      } else if (timeUntilExpiry > 0) {
        // Less than 10 seconds left, don't bother refreshing
        console.log("Token expires soon, no refresh needed");
      } else {
        // Token is already expired, try to refresh once if we haven't recently
        const now = Date.now();
        if (now - lastRefreshAttempt.current > MIN_REFRESH_INTERVAL) {
          console.log("Token expired, attempting refresh once");
          refreshToken();
        }
      }
    }

    return () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
    };
  }, [state.isAuthenticated, state.expiresAt, refreshToken]);

  const value = React.useMemo(
    () => ({
      ...state,
      login,
      logout,
      updateUser,
      setAuthenticationStatus,
      refreshToken,
    }),
    [state, login, logout, updateUser, setAuthenticationStatus, refreshToken]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

const useAuth = (): AuthContextType => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export { AuthProvider, useAuth };
