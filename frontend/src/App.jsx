import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Tumhare components (Ensure paths match your folder structure)
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Upload from './pages/Upload';
import Verification from './pages/Verification';
import RecordDetails from './pages/RecordDetails';
import MapPage from './pages/Map';
import Sidebar from './components/Sidebar'; 

// THE GUARD
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('auth_token');
  if (!token) return <Navigate to="/" replace />;
  return children;
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        {/* THE FIX: Added /* right here so nested routes are recognized */}
        <Route 
          path="/dashboard/*" 
          element={
            <ProtectedRoute>
              <div className="flex h-screen bg-stone-100">
                <Sidebar />
                <main className="flex-1 overflow-y-auto p-8">
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="upload" element={<Upload />} />
                    <Route path="verification" element={<Verification />} />
                    <Route path="record/:id" element={<RecordDetails />} />
                    <Route path="map" element={<MapPage />} />
                  </Routes>
                </main>
              </div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}