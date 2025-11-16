
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { GlobalStateProvider, useGlobalState } from './context/GlobalStateContext';
import AuthPage from './pages/AuthPage';
import DashboardLayout from './pages/DashboardLayout';
import ImageGeneratorPage from './pages/user/ImageGeneratorPage';
import BuyCreditsPage from './pages/user/BuyCreditsPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import UserManagementPage from './pages/admin/UserManagementPage';
import PaymentVerificationPage from './pages/admin/PaymentVerificationPage';
import SettingsPage from './pages/admin/SettingsPage';

const App: React.FC = () => {
  return (
    <GlobalStateProvider>
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          className: '',
          style: {
            margin: '40px',
            background: '#1e293b',
            color: '#fff',
            border: '1px solid #334155',
          },
        }}
      />
      <AppRoutes />
    </GlobalStateProvider>
  );
};

const AppRoutes: React.FC = () => {
  const { isAuthenticated, currentUser } = useGlobalState();

  return (
    <HashRouter>
      <Routes>
        <Route path="/auth" element={!isAuthenticated ? <AuthPage /> : <Navigate to="/" />} />
        
        <Route path="/" element={isAuthenticated ? <DashboardLayout /> : <Navigate to="/auth" />}>
          {currentUser?.role === 'user' && (
            <>
              <Route index element={<ImageGeneratorPage />} />
              <Route path="buy-credits" element={<BuyCreditsPage />} />
            </>
          )}

          {currentUser?.role === 'admin' && (
            <>
              <Route index element={<AdminDashboardPage />} />
              <Route path="user-management" element={<UserManagementPage />} />
              <Route path="payment-verification" element={<PaymentVerificationPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </>
          )}
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </HashRouter>
  );
};

export default App;
