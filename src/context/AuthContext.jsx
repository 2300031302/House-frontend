import React, { createContext, useContext, useReducer, useEffect } from 'react';
import usersData from '../data/users.json';
import professionalsData from '../data/professionals.json';
import adminsData from '../data/admins.json';

const initialState = {
  isAuthenticated: false,
  user: null,
  userType: null,
  loading: false,
};

function authReducer(state, action) {
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

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const savedAuth = localStorage.getItem('homeServiceAuth');
    if (savedAuth) {
      try {
        const { user, userType } = JSON.parse(savedAuth);
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

  const login = async (email, password, userType) => {
    dispatch({ type: 'LOGIN_START' });
    await new Promise(resolve => setTimeout(resolve, 1000));

    let user = null;

    if (userType === 'user') {
      const userData = usersData.find(u => u.email === email);
      if (userData && password === 'user123') {
        user = { ...userData, role: 'user' };
      }
    } else if (userType === 'professional') {
      const professionalData = professionalsData.find(p => p.name.toLowerCase().replace(' ', '.') + '@homeservices.com' === email);
      if (professionalData && password === 'pro123') {
        user = { 
          ...professionalData, 
          email: professionalData.name.toLowerCase().replace(' ', '.') + '@homeservices.com',
          role: 'professional'
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

  const signup = async (userData) => {
    dispatch({ type: 'LOGIN_START' });
    await new Promise(resolve => setTimeout(resolve, 1000));

    const existingUser = usersData.find(u => u.email === userData.email);
    if (existingUser) {
      dispatch({ type: 'LOGIN_FAILURE' });
      return false;
    }

    const newUser = {
      id: (usersData.length + 1).toString(),
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      address: userData.address,
      memberSince: new Date().toISOString().split('T')[0],
      image: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
      role: 'user',
    };

    usersData.push(newUser);

    dispatch({ type: 'LOGIN_SUCCESS', payload: { user: newUser, userType: 'user' } });
    localStorage.setItem('homeServiceAuth', JSON.stringify({ user: newUser, userType: 'user' }));
    return true;
  };

  const updateProfile = (userData) => {
    dispatch({ type: 'LOGIN_SUCCESS', payload: { user: userData, userType: state.userType } });
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

export default AuthContext;
