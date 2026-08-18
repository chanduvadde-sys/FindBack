import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import { MapPin, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const MyReports = () => {
  const { token } = useContext(AuthContext);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchReports = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/my-reports`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setReports(data.items);
      } else {
        setError('Failed to load your reports.');
      }
    } catch (err) {
      setError('Error connecting to the server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchReports();
  }, [token]);

  const getTimeAgo = (dateStr) => {
    const r = new Date(dateStr);
    const diff = Math.floor((new Date() - r) / 60000); // mins
    if (diff < 60) return `${diff}m ago`;
    const h = Math.floor(diff / 60);
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
  };

  const getStatusColor = (status) => {
    if (!status || status === 'pending') return 'text-text-muted';
    if (status === 'analyzing') return 'text-orange';
    if (status === 'potential_match') return 'text-cyan';
    if (status === 'match_found' || status === 'recovered') return 'text-neon-green';
    return 'text-text-secondary';
  };

  const formatStatus = (status) => {
    if (!status) return 'Reported';
    return status.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  if (loading) return <div className="text-text-secondary animate-pulse p-4">Loading reports...</div>;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-text-primary">My Reports</h2>
        <Link to="/report-lost" className="btn-primary text-sm px-4 py-2">
          + Report Item
        </Link>
      </div>

      {error && <div className="text-red-400 bg-red-500/10 p-4 rounded-xl border border-red-500/20">{error}</div>}

      {!loading && reports.length === 0 && !error && (
        <div className="glass-card p-12 flex flex-col items-center justify-center text-center gap-4">
          <div className="w-16 h-16 rounded-full bg-bg-dark border border-border-subtle flex items-center justify-center mb-2">
            <span className="text-2xl">📦</span>
          </div>
          <h3 className="text-lg font-bold text-text-primary">No reports yet</h3>
          <p className="text-sm text-text-secondary">Your lost and found reports will appear here.</p>
          <Link to="/report-lost" className="btn-secondary mt-2">Report an Item</Link>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reports.map((report, i) => (
          <motion.div 
            key={report.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 * i }}
            className="glass-card p-5 flex flex-col gap-4 cursor-pointer hover:border-border-active transition-all group"
          >
            <div className="flex gap-4">
              <div className="w-20 h-20 bg-bg-dark rounded-xl flex items-center justify-center text-4xl border border-border-subtle shadow-inner flex-shrink-0">
                {report.category === 'electronics' ? '📱' : report.category === 'bag' ? '🎒' : report.category === 'keys' ? '🔑' : '📦'}
              </div>
              
              <div className="flex flex-col justify-between py-1 flex-1 min-w-0">
                <div>
                  <div className="flex justify-between items-start mb-1">
                    <span className={`text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-sm ${report.type === 'Lost' ? 'bg-orange/10 text-orange' : 'bg-neon-green/10 text-neon-green'}`}>
                      {report.type}
                    </span>
                    
                    <span className={`text-[10px] font-bold tracking-wider uppercase ${getStatusColor(report.status)}`}>
                      {formatStatus(report.status)}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-text-primary truncate">{report.category}</h4>
                  <p className="text-xs text-text-muted truncate">{report.description || 'No description provided'}</p>
                </div>
              </div>
            </div>

            <div className="h-px bg-border-subtle w-full" />

            <div className="flex items-center justify-between text-[11px] text-text-secondary">
              <div className="flex items-center gap-1.5 truncate pr-2">
                <MapPin className="w-3.5 h-3.5 flex-shrink-0" /> 
                <span className="truncate">{report.location_text}</span>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <Clock className="w-3.5 h-3.5" /> 
                {getTimeAgo(report.created_at)}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default MyReports;
