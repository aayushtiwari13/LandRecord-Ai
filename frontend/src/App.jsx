import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Pages & Components
import LandingPage from './pages/LandingPage';
import Login from './pages/Login'; // <-- TUMHARA NAYA LOGIN IMPORT
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Upload from './pages/Upload';
import Verification from './pages/Verification';
import RecordDetails from './pages/RecordDetails';
import MapPage from './pages/Map';

// 🛑 SECURITY GUARD: Ye check karega ki user logged in hai ya nahi
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('auth_token') || localStorage.getItem('token');
  if (!token) {
    // Agar token nahi mila, toh wapas login pe phek do
    return <Navigate to="/login" replace />; 
  }
  return children;
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} /> {/* <-- NAYA LOGIN ROUTE */}
        
        {/* Protected Dashboard Routes (Ab bina login ke nahi khulenge) */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          {/* Sub-pages */}
          <Route index element={<Dashboard />} />
          <Route path="upload" element={<Upload />} />
          <Route path="verification" element={<Verification />} />
          <Route path="map" element={<MapPage />} />
          <Route path="record/:id" element={<RecordDetails />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}