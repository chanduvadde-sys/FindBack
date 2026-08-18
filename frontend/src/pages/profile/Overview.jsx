import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { User, FileText, Search, MapPin, CheckCircle2, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

const StatCard = ({ icon: Icon, title, value, trendUp, delay }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className="glass-card p-6 flex flex-col gap-4"
  >
    <div className="flex items-center gap-3">
      <div className={`p-2 rounded-lg ${trendUp ? 'bg-neon-green/10 text-neon-green' : 'bg-orange/10 text-orange'}`}>
        <Icon className="w-5 h-5" />
      </div>
      <h3 className="text-sm font-medium text-text-secondary">{title}</h3>
    </div>
    <div className="flex items-end justify-between">
      <span className="text-3xl font-heading font-bold text-text-primary">{value}</span>
    </div>
  </motion.div>
);

const Overview = () => {
  const { user, token } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/my-analytics`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
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

    if (token) {
      fetchAnalytics();
    }
  }, [token]);

  if (loading) {
    return <div className="text-text-secondary animate-pulse p-4">Loading profile...</div>;
  }

  const joinDate = user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) : '2026';

  return (
    <div className="flex flex-col gap-8">
      {/* Profile Header */}
      <div className="glass-card p-8 relative overflow-hidden flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <div className="absolute top-0 right-0 w-64 h-64 bg-neon-green/5 rounded-full blur-[80px] pointer-events-none" />
        
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-bg-dark to-border-subtle border-2 border-neon-green/30 flex items-center justify-center text-4xl shadow-[0_0_20px_rgba(57,255,136,0.15)] flex-shrink-0 z-10">
          <User className="w-10 h-10 text-text-secondary" />
        </div>
        
        <div className="flex flex-col items-center sm:items-start gap-2 z-10 text-center sm:text-left">
          <h1 className="text-3xl font-heading font-bold text-text-primary">
            {user?.user_metadata?.name || 'FindBack User'}
          </h1>
          <a href={`mailto:${user?.email}`} className="text-neon-green hover:underline">
            {user?.email}
          </a>
          
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-2">
            <span className="flex items-center gap-1.5 text-xs font-medium text-text-secondary bg-bg-dark/50 px-3 py-1.5 rounded-full border border-border-subtle">
              <Calendar className="w-3.5 h-3.5" /> Member since {joinDate}
            </span>
            <span className="flex items-center gap-1.5 text-xs font-medium text-text-secondary bg-bg-dark/50 px-3 py-1.5 rounded-full border border-border-subtle">
              ID: {user?.id?.substring(0, 8)}...
            </span>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold text-text-primary mb-4">Activity Summary</h2>
        
        {error ? (
          <div className="text-red-400 bg-red-500/10 p-4 rounded-xl border border-red-500/20">{error}</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard icon={FileText} title="Total Reports" value={stats?.totalReports || 0} trendUp delay={0.1} />
            <StatCard icon={Search} title="Lost Reports" value={stats?.lostItems || 0} trendUp delay={0.2} />
            <StatCard icon={MapPin} title="Found Reports" value={stats?.foundItems || 0} trendUp delay={0.3} />
            <StatCard icon={CheckCircle2} title="Recoveries" value={stats?.successfulRecoveries || 0} trendUp delay={0.4} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Overview;
