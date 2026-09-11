import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Pages & Components
import LandingPage from './pages/LandingPage';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Upload from './pages/Upload';
import Verification from './pages/Verification';
import RecordDetails from './pages/RecordDetails';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing Page Root path (/) par khulega */}
        <Route path="/" element={<LandingPage />} />
        
        {/* Layout wala section /dashboard par khulega */}
        <Route path="/dashboard" element={<Layout />}>
          {/* Default dashboard page */}
          <Route index element={<Dashboard />} />
          
          {/* Baki sub-pages */}
          <Route path="upload" element={<Upload />} />
          <Route path="verification" element={<Verification />} />
          <Route path="record/:id" element={<RecordDetails />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}