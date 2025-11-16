import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { User, PaymentRequest, AppSettings, CreditPackage } from '../types';
import placeholderQr from '../assets/placeholder-qr';

interface GlobalState {
  currentUser: User | null;
  isAuthenticated: boolean;
  users: User[];
  payments: PaymentRequest[];
  settings: AppSettings;
}

const initialState: GlobalState = {
  currentUser: null,
  isAuthenticated: false,
  users: [],
  payments: [],
  settings: {
    paymentDetails: {
      methodName: 'Bkash/Nagad',
      accountNumber: '01700000000',
      qrCodeUrl: placeholderQr
    },
    creditPackages: [
      { id: 'pkg1', name: 'Starter Pack', credits: 100, price: 50 },
      { id: 'pkg2', name: 'Pro Pack', credits: 500, price: 200 },
      { id: 'pkg3', name: 'Business Pack', credits: 1200, price: 500 },
    ]
  }
};

type Action =
  | { type: 'LOGIN'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'SIGNUP'; payload: User }
  | { type: 'ADD_PAYMENT_REQUEST'; payload: PaymentRequest }
  | { type: 'UPDATE_PAYMENT_STATUS'; payload: { paymentId: string; status: 'approved' | 'rejected' } }
  | { type: 'UPDATE_USER_CREDITS'; payload: { userId: string; credits: number } }
  | { type: 'TOGGLE_USER_STATUS'; payload: { userId: string } }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<AppSettings> }
  | { type: 'ADD_PACKAGE'; payload: CreditPackage }
  | { type: 'UPDATE_PACKAGE'; payload: CreditPackage }
  | { type: 'DELETE_PACKAGE'; payload: string };

const stateReducer = (state: GlobalState, action: Action): GlobalState => {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, isAuthenticated: true, currentUser: action.payload };
    case 'LOGOUT':
      return { ...state, isAuthenticated: false, currentUser: null };
    case 'SIGNUP':
      return { ...state, isAuthenticated: true, currentUser: action.payload, users: [...state.users, action.payload] };
    case 'ADD_PAYMENT_REQUEST':
      return { ...state, payments: [...state.payments, action.payload] };
    case 'UPDATE_PAYMENT_STATUS': {
      const { paymentId, status } = action.payload;
      return {
        ...state,
        payments: state.payments.map(p => p.id === paymentId ? { ...p, status } : p)
      };
    }
    case 'UPDATE_USER_CREDITS': {
      const { userId, credits } = action.payload;
      const newCredits = (userCredits: number) => Math.max(0, userCredits + credits);
      return {
        ...state,
        users: state.users.map(u => u.id === userId ? { ...u, credits: newCredits(u.credits) } : u),
        currentUser: state.currentUser?.id === userId ? { ...state.currentUser, credits: newCredits(state.currentUser.credits) } : state.currentUser
      };
    }
    case 'TOGGLE_USER_STATUS': {
      const { userId } = action.payload;
      return {
        ...state,
        users: state.users.map(u => u.id === userId ? { ...u, status: u.status === 'active' ? 'blocked' : 'active' } : u)
      };
    }
    case 'UPDATE_SETTINGS': {
        return {
            ...state,
            settings: {
                ...state.settings,
                ...action.payload,
                paymentDetails: {
                    ...state.settings.paymentDetails,
                    ...action.payload.paymentDetails
                }
            }
        }
    }
    case 'ADD_PACKAGE':
        return { ...state, settings: { ...state.settings, creditPackages: [...state.settings.creditPackages, action.payload] } };
    case 'UPDATE_PACKAGE':
        return { ...state, settings: { ...state.settings, creditPackages: state.settings.creditPackages.map(p => p.id === action.payload.id ? action.payload : p) } };
    case 'DELETE_PACKAGE':
        return { ...state, settings: { ...state.settings, creditPackages: state.settings.creditPackages.filter(p => p.id !== action.payload) } };
    default:
      return state;
  }
};

const GlobalStateContext = createContext<{
  state: GlobalState;
  dispatch: React.Dispatch<Action>;
}>({
  state: initialState,
  dispatch: () => null,
});

export const GlobalStateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(stateReducer, initialState);
  return (
    <GlobalStateContext.Provider value={{ state, dispatch }}>
      {children}
    </GlobalStateContext.Provider>
  );
};

export const useGlobalState = () => {
  const context = useContext(GlobalStateContext);
  if (context === undefined) {
    throw new Error('useGlobalState must be used within a GlobalStateProvider');
  }
  const { state, dispatch } = context;
  return { ...state, dispatch };
};
