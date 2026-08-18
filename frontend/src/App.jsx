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

import ProfileLayout from './pages/profile/ProfileLayout';
import Overview from './pages/profile/Overview';
import MyReports from './pages/profile/MyReports';
import Messages from './pages/profile/Messages';
import Analytics from './pages/profile/Analytics';
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
            <Route path="/profile" element={<ProtectedRoute><ProfileLayout /></ProtectedRoute>}>
              <Route index element={<Overview />} />
              <Route path="reports" element={<MyReports />} />
              <Route path="messages" element={<Messages />} />
              <Route path="analytics" element={<Analytics />} />
            </Route>
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
