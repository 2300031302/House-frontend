import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useAuth } from './AuthContext.jsx';
import servicesData from '../data/services.json';
import professionalsData from '../data/professionals.json';
import usersData from '../data/users.json';

const initialState = {
  services: servicesData,
  professionals: professionalsData,
  users: usersData,
  bookings: [],
  notifications: [],
};

function appReducer(state, action) {
  switch (action.type) {
    case 'ADD_BOOKING':
      return { ...state, bookings: [...state.bookings, action.payload] };
    case 'UPDATE_BOOKING':
      return {
        ...state,
        bookings: state.bookings.map(booking =>
          booking.id === action.payload.id
            ? { ...booking, ...action.payload.updates }
            : booking
        ),
      };
    case 'CANCEL_BOOKING':
      return {
        ...state,
        bookings: state.bookings.map(booking =>
          booking.id === action.payload
            ? { ...booking, status: 'cancelled' }
            : booking
        ),
      };
    case 'ADD_NOTIFICATION':
      return { ...state, notifications: [action.payload, ...state.notifications] };
    case 'MARK_NOTIFICATION_READ':
      return {
        ...state,
        notifications: state.notifications.map(notif =>
          notif.id === action.payload ? { ...notif, read: true } : notif
        ),
      };
    case 'LOAD_BOOKINGS':
      return { ...state, bookings: action.payload };
    default:
      return state;
  }
}

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const { state: authState } = useAuth();

  useEffect(() => {
    const savedBookings = localStorage.getItem('homeServiceBookings');
    if (savedBookings) {
      try {
        const bookings = JSON.parse(savedBookings);
        if (Array.isArray(bookings)) {
          dispatch({ type: 'LOAD_BOOKINGS', payload: bookings });
        }
      } catch (error) {
        console.error('Error loading bookings:', error);
        localStorage.removeItem('homeServiceBookings');
      }
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('homeServiceBookings', JSON.stringify(state.bookings));
    } catch (error) {
      console.error('Error saving bookings:', error);
    }
  }, [state.bookings]);

  const getCurrentUser = () => {
    if (authState.userType === 'user' && authState.user) {
      return authState.user;
    }
    return null;
  };

  const contextValue = {
    state: {
      ...state,
      currentUser: getCurrentUser(),
      userType: authState.userType,
    },
    dispatch,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

export default AppContext;
