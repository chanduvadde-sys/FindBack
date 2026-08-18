import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import { Activity, PieChart, BarChart3, Target } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Analytics = () => {
  const { token } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/my-analytics`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        
        if (data.success) {
          setStats(data.analytics);
        } else {
          setError('Failed to load analytics.');
        }
      } catch (err) {
        setError('Error connecting to server.');
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchAnalytics();
  }, [token]);

  if (loading) return <div className="text-text-secondary animate-pulse p-4">Loading analytics...</div>;

  if (!loading && stats?.totalReports === 0) {
    return (
      <div className="flex flex-col gap-6">
        <h2 className="text-2xl font-bold text-text-primary">Personal Analytics</h2>
        <div className="glass-card p-12 flex flex-col items-center justify-center text-center gap-4">
          <div className="w-16 h-16 rounded-full bg-bg-dark border border-border-subtle flex items-center justify-center mb-2">
            <Activity className="w-8 h-8 text-text-secondary" />
          </div>
          <h3 className="text-lg font-bold text-text-primary">No analytics available yet</h3>
          <p className="text-sm text-text-secondary max-w-sm">Report an item to start building your personal recovery insights.</p>
          <Link to="/report-lost" className="btn-secondary mt-2">Report an Item</Link>
        </div>
      </div>
    );
  }

  // Calculate percentages for visual bars
  const total = stats?.totalReports || 1;
  const lostPct = ((stats?.lostItems || 0) / total) * 100;
  const foundPct = ((stats?.foundItems || 0) / total) * 100;
  
  const matchesTotal = stats?.matchesFound || 1;
  const successPct = Math.min(100, ((stats?.successfulRecoveries || 0) / (stats?.totalReports || 1)) * 100);

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-2xl font-bold text-text-primary">Personal Analytics</h2>

      {error && <div className="text-red-400 bg-red-500/10 p-4 rounded-xl border border-red-500/20">{error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Lost vs Found */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6 flex flex-col gap-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-cyan/10 text-cyan">
              <PieChart className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-text-primary">Lost vs Found</h3>
          </div>
          
          <div className="flex flex-col gap-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-orange font-medium">Lost Items ({stats?.lostItems})</span>
                <span className="text-text-secondary">{Math.round(lostPct)}%</span>
              </div>
              <div className="w-full h-3 bg-bg-dark rounded-full overflow-hidden border border-border-subtle">
                <div className="h-full bg-orange transition-all duration-1000" style={{ width: `${lostPct}%` }} />
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-neon-green font-medium">Found Items ({stats?.foundItems})</span>
                <span className="text-text-secondary">{Math.round(foundPct)}%</span>
              </div>
              <div className="w-full h-3 bg-bg-dark rounded-full overflow-hidden border border-border-subtle">
                <div className="h-full bg-neon-green transition-all duration-1000" style={{ width: `${foundPct}%` }} />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Recovery Success */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-6 flex flex-col gap-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-neon-green/10 text-neon-green">
              <Target className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-text-primary">Recovery Success</h3>
          </div>
          
          <div className="flex flex-col items-center justify-center flex-1">
            <div className="relative w-32 h-32 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="var(--color-bg-dark)" strokeWidth="10" />
                <circle 
                  cx="50" cy="50" r="40" fill="transparent" 
                  stroke="var(--color-neon-green)" 
                  strokeWidth="10" 
                  strokeDasharray={`${251.2 * (successPct / 100)} 251.2`} 
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out drop-shadow-[0_0_8px_rgba(57,255,136,0.5)]"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-2xl font-heading font-bold text-text-primary">{Math.round(successPct)}%</span>
                <span className="text-[10px] text-text-muted uppercase tracking-wider">Success</span>
              </div>
            </div>
            <p className="text-sm text-text-secondary mt-4 text-center">
              You have successfully recovered <span className="text-text-primary font-bold">{stats?.successfulRecoveries}</span> out of {total} reported items.
            </p>
          </div>
        </motion.div>

        {/* AI Matches Overview */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6 flex flex-col gap-6 lg:col-span-2"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-text-primary">Match Activity</h3>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-bg-dark border border-border-subtle p-4 rounded-xl text-center">
              <span className="text-3xl font-heading font-bold text-text-primary block">{stats?.totalReports}</span>
              <span className="text-xs text-text-secondary">Total Reports</span>
            </div>
            <div className="bg-bg-dark border border-border-subtle p-4 rounded-xl text-center">
              <span className="text-3xl font-heading font-bold text-cyan block">{stats?.matchesFound}</span>
              <span className="text-xs text-text-secondary">Matches Found</span>
            </div>
            <div className="bg-bg-dark border border-border-subtle p-4 rounded-xl text-center">
              <span className="text-3xl font-heading font-bold text-orange block">{stats?.pendingMatches}</span>
              <span className="text-xs text-text-secondary">Pending Resolution</span>
            </div>
            <div className="bg-bg-dark border border-border-subtle p-4 rounded-xl text-center">
              <span className="text-3xl font-heading font-bold text-neon-green block">{stats?.successfulRecoveries}</span>
              <span className="text-xs text-text-secondary">Recovered</span>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default Analytics;
