import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

// Context Providers
import { AuthProvider } from './context/AuthContext';
import { DashboardProvider } from './context/DashboardContext';
import { UserProvider } from './context/UserContext';
import { RiderProvider } from './context/RiderContext';
import { WalletProvider } from './context/WalletContext';
import { SupportProvider } from './context/SupportContext';
import { SettingsProvider } from './context/SettingsContext';

// Routes
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <Router>
      <AuthProvider>
        <DashboardProvider>
          <UserProvider>
            <RiderProvider>
              <WalletProvider>
                <SupportProvider>
                  <SettingsProvider>
                    <AppRoutes />
                  </SettingsProvider>
                </SupportProvider>
              </WalletProvider>
            </RiderProvider>
          </UserProvider>
        </DashboardProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
