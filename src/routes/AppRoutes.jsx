import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import AdminLayout from '../layouts/AdminLayout';

// Pages
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import Analytics from '../pages/Analytics';
import Wallet from '../pages/Wallet';
import RideHistory from '../pages/RideHistory';
import Users from '../pages/Users';
import Riders from '../pages/Riders';
import CustomerSupport from '../pages/CustomerSupport';
import KYC from '../pages/KYC';
import Settings from '../pages/Settings';

function AppRoutes() {
  return (
    <Routes>
      {/* Auth Route */}
      <Route path="/login" element={<Login />} />

      {/* Main Admin Workspace Routes */}
      <Route 
        path="/" 
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        {/* Redirect Root path to Dashboard */}
        <Route index element={<Navigate to="/dashboard" replace />} />
        
        {/* Subpages mapping and module constraints */}
        <Route 
          path="dashboard" 
          element={
            <ProtectedRoute moduleName="Dashboard">
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="analytics" 
          element={
            <ProtectedRoute moduleName="Analytics">
              <Analytics />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="wallet" 
          element={
            <ProtectedRoute moduleName="Wallet">
              <Wallet />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="ride-history" 
          element={
            <ProtectedRoute moduleName="Dashboard">
              <RideHistory />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="users" 
          element={
            <ProtectedRoute moduleName="Dashboard">
              <Users />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="riders" 
          element={
            <ProtectedRoute moduleName="Dashboard">
              <Riders />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="support" 
          element={
            <ProtectedRoute moduleName="Support">
              <CustomerSupport />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="kyc" 
          element={
            <ProtectedRoute moduleName="KYC">
              <KYC />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="settings" 
          element={
            <ProtectedRoute moduleName="Settings">
              <Settings />
            </ProtectedRoute>
          } 
        />
      </Route>

      {/* Catch-all redirect to login/dashboard */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default AppRoutes;
