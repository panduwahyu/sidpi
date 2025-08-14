// Simple App.js tanpa authentication (src/App.js)
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import components
import Homepage from './components/Homepage';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/admin/AdminDashboard';
import StoriesList from './components/StoriesList';
import StoryDetail from './components/StoryDetail';
import StoryEditor from './components/admin/StoryEditor';

// Global CSS
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Homepage />} />
          <Route path="/stories" element={<StoriesList />} />
          <Route path="/stories/:slug" element={<StoryDetail />} />
          
          {/* Admin Routes - Direct Access */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/stories/create" element={<StoryEditor />} />
          <Route path="/admin/stories/:id/edit" element={<StoryEditor />} />
          
          {/* Redirects */}
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          
          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

// Simple 404 Component
const NotFound = () => (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    textAlign: 'center',
    color: '#6b7280'
  }}>
    <h1 style={{ fontSize: '48px', margin: '0 0 16px 0', color: '#1f2937' }}>404</h1>
    <p style={{ fontSize: '18px', margin: '0 0 24px 0' }}>Halaman tidak ditemukan</p>
    <a 
      href="/" 
      style={{
        background: '#3b82f6',
        color: 'white',
        padding: '12px 24px',
        borderRadius: '8px',
        textDecoration: 'none',
        fontWeight: '600'
      }}
    >
      Kembali ke Beranda
    </a>
  </div>
);

export default App;