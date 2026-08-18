import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

import Home from './pages/Home';
import ReportLost from './pages/ReportLost';
import ReportFound from './pages/ReportFound';
import MyMatches from './pages/MyMatches';
import Login from './pages/Login';
import Register from './pages/Register';

// New UI Pages
import Dashboard from './pages/Dashboard';
import AIEngine from './pages/AIEngine';
import ItemsFeed from './pages/ItemsFeed';
import MatchDetail from './pages/MatchDetail';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* New UI Routes */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/ai-engine" element={<AIEngine />} />
            <Route path="/items" element={<ItemsFeed />} />
            <Route path="/matches/:id" element={<ProtectedRoute><MatchDetail /></ProtectedRoute>} />
            
            {/* Existing Functionality */}
            <Route path="/report-lost" element={<ProtectedRoute><ReportLost /></ProtectedRoute>} />
            <Route path="/report-found" element={<ProtectedRoute><ReportFound /></ProtectedRoute>} />
            <Route path="/my-matches" element={<ProtectedRoute><MyMatches /></ProtectedRoute>} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;
