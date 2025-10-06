import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import usersData from '../data/users.json';
import professionalsData from '../data/professionals.json';
import adminsData from '../data/admins.json';

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  memberSince?: string;
  image: string;
  password?: string;
  role: 'user';
}

interface Professional {
  id: string;
  name: string;
  email?: string;
  password?: string;
  specialty: string;
  serviceIds: string[];
  rating: number;
  reviewCount: number;
  experience: string;
  availability: string[];
  image: string;
  bio: string;
  hourlyRate: number;
  role: 'professional';
}

interface Admin {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'admin';
  image: string;
}

type AuthUser = User | Professional | Admin;

interface AuthState {
  isAuthenticated: boolean;
  user: AuthUser | null;
  userType: 'user' | 'professional' | 'admin' | null;
  loading: boolean;
}

type AuthAction = 
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: { user: AuthUser; userType: 'user' | 'professional' | 'admin' } }
  | { type: 'LOGIN_FAILURE' }
  | { type: 'LOGOUT' }
  | { type: 'SET_LOADING'; payload: boolean };

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  userType: null,
  loading: false,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, loading: true };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        userType: action.payload.userType,
        loading: false,
      };
    case 'LOGIN_FAILURE':
      return { ...state, loading: false };
    case 'LOGOUT':
      return { ...initialState };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    default:
      return state;
  }
}

const AuthContext = createContext<{
  state: AuthState;
  login: (email: string, password: string, userType: 'user' | 'professional' | 'admin') => Promise<boolean>;
  signup: (userData: { name: string; email: string; password: string; phone: string; address: string }) => Promise<boolean>;
  updateProfile: (userData: any) => void;
  logout: () => void;
} | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    // Check for saved auth state
    const savedAuth = localStorage.getItem('homeServiceAuth');
    if (savedAuth) {
      try {
        const { user, userType } = JSON.parse(savedAuth);
        // Validate the saved data before setting auth state
        if (user && userType && ['user', 'professional', 'admin'].includes(userType)) {
          dispatch({ type: 'LOGIN_SUCCESS', payload: { user, userType } });
        } else {
          localStorage.removeItem('homeServiceAuth');
        }
      } catch (error) {
        console.error('Error parsing saved auth:', error);
        localStorage.removeItem('homeServiceAuth');
      }
    }
  }, []);

  const login = async (email: string, password: string, userType: 'user' | 'professional' | 'admin'): Promise<boolean> => {
    dispatch({ type: 'LOGIN_START' });

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    let user: AuthUser | null = null;

    if (userType === 'user') {
      const userData = usersData.find(u => u.email === email);
      if (userData && password === 'user123') { // Simple password for demo
        user = { ...userData, role: 'user' as const };
      }
    } else if (userType === 'professional') {
      const professionalData = professionalsData.find(p => p.name.toLowerCase().replace(' ', '.') + '@homeservices.com' === email);
      if (professionalData && password === 'pro123') { // Simple password for demo
        user = { 
          ...professionalData, 
          email: professionalData.name.toLowerCase().replace(' ', '.') + '@homeservices.com',
          role: 'professional' as const 
        };
      }
    } else if (userType === 'admin') {
      const adminData = adminsData.find(a => a.email === email && a.password === password);
      if (adminData) {
        user = adminData;
      }
    }

    if (user) {
      dispatch({ type: 'LOGIN_SUCCESS', payload: { user, userType } });
      localStorage.setItem('homeServiceAuth', JSON.stringify({ user, userType }));
      return true;
    } else {
      dispatch({ type: 'LOGIN_FAILURE' });
      return false;
    }
  };

  const signup = async (userData: { name: string; email: string; password: string; phone: string; address: string }): Promise<boolean> => {
    dispatch({ type: 'LOGIN_START' });

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Check if email already exists
    const existingUser = usersData.find(u => u.email === userData.email);
    if (existingUser) {
      dispatch({ type: 'LOGIN_FAILURE' });
      return false;
    }

    // Create new user
    const newUser: User = {
      id: (usersData.length + 1).toString(),
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      address: userData.address,
      memberSince: new Date().toISOString().split('T')[0],
      image: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
      role: 'user' as const,
    };

    // In a real app, this would be saved to the backend
    // For demo purposes, we'll just add to local data and proceed with login
    usersData.push(newUser);

    dispatch({ type: 'LOGIN_SUCCESS', payload: { user: newUser, userType: 'user' } });
    localStorage.setItem('homeServiceAuth', JSON.stringify({ user: newUser, userType: 'user' }));
    return true;
  };

  const updateProfile = (userData: any) => {
    // Update the user in the auth state
    dispatch({ type: 'LOGIN_SUCCESS', payload: { user: userData, userType: state.userType! } });
    
    // Update localStorage
    localStorage.setItem('homeServiceAuth', JSON.stringify({ user: userData, userType: state.userType }));
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
    localStorage.removeItem('homeServiceAuth');
  };

  return (
    <AuthContext.Provider value={{ state, login, signup, updateProfile, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export type { User, Professional, Admin, AuthUser };