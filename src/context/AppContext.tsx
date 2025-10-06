import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import servicesData from '../data/services.json';
import professionalsData from '../data/professionals.json';
import usersData from '../data/users.json';

interface Service {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  duration: string;
  image: string;
  features: string[];
}

interface Professional {
  id: string;
  name: string;
  specialty: string;
  serviceIds: string[];
  rating: number;
  reviewCount: number;
  experience: string;
  availability: string[];
  image: string;
  bio: string;
  hourlyRate: number;
}

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  memberSince: string;
  image: string;
}

interface Booking {
  id: string;
  userId: string;
  serviceId: string;
  professionalId: string;
  date: string;
  time: string;
  address: string;
  notes: string;
  status: 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
  createdAt: string;
  price: number;
  rating?: number;
  review?: string;
}

interface Notification {
  id: string;
  type: 'booking' | 'completion' | 'cancellation';
  message: string;
  timestamp: string;
  read: boolean;
}

interface AppState {
  services: Service[];
  professionals: Professional[];
  users: User[];
  bookings: Booking[];
  notifications: Notification[];
}

type AppAction = 
  | { type: 'ADD_BOOKING'; payload: Booking }
  | { type: 'UPDATE_BOOKING'; payload: { id: string; updates: Partial<Booking> } }
  | { type: 'CANCEL_BOOKING'; payload: string }
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'MARK_NOTIFICATION_READ'; payload: string }
  | { type: 'LOAD_BOOKINGS'; payload: Booking[] };

const initialState: AppState = {
  services: servicesData,
  professionals: professionalsData,
  users: usersData,
  bookings: [],
  notifications: [],
};

function appReducer(state: AppState, action: AppAction): AppState {
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
            ? { ...booking, status: 'cancelled' as const }
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

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const { state: authState } = useAuth();

  useEffect(() => {
    // Load bookings from localStorage
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
    // Save bookings to localStorage
    try {
      localStorage.setItem('homeServiceBookings', JSON.stringify(state.bookings));
    } catch (error) {
      console.error('Error saving bookings:', error);
    }
  }, [state.bookings]);

  // Get current user based on auth state
  const getCurrentUser = () => {
    if (authState.userType === 'user' && authState.user) {
      return authState.user as User;
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

export type { Service, Professional, User, Booking, Notification };