import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Brain, ChevronRight, Clock, ShieldCheck, CheckCircle2, KeyRound } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const Messages = () => {
  const { token, user } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchMessages();
  }, [token]);

  const fetchMessages = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/my-messages`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      
      if (data.success) {
        setMessages(data.messages);
      } else {
        setError('Failed to load messages.');
      }
    } catch (err) {
      setError('Error connecting to the server.');
    } finally {
      setLoading(false);
    }
  };

  const handleHandoverAction = async (requestId, action) => {
    setUpdating(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/handover/${requestId}/${action}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        await fetchMessages();
      } else {
        alert(data.error || `Failed to ${action} handover`);
      }
    } catch (e) {
      alert('Network error');
    }
    setUpdating(false);
  };

  const getTimeAgo = (dateStr) => {
    const r = new Date(dateStr);
    const diff = Math.floor((new Date() - r) / 60000); // mins
    if (diff < 60) return `${diff}m ago`;
    const h = Math.floor(diff / 60);
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
  };

  if (loading) return <div className="text-text-secondary animate-pulse p-4">Loading messages...</div>;

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-2xl font-bold text-text-primary">Messages & Notifications</h2>

      {error && <div className="text-red-400 bg-red-500/10 p-4 rounded-xl border border-red-500/20">{error}</div>}

      {!loading && messages.length === 0 && !error && (
        <div className="glass-card p-12 flex flex-col items-center justify-center text-center gap-4">
          <div className="w-16 h-16 rounded-full bg-bg-dark border border-border-subtle flex items-center justify-center mb-2">
            <Brain className="w-8 h-8 text-text-secondary" />
          </div>
          <h3 className="text-lg font-bold text-text-primary">No messages yet</h3>
          <p className="text-sm text-text-secondary max-w-sm">When FindBack's AI finds a potential match for your reported items, you'll see it here.</p>
        </div>
      )}

      <div className="flex flex-col gap-4">
        {messages.map((match, i) => {
          const isMyLost = match.lost_items?.user_id === user?.id;
          const relevantItem = isMyLost ? match.lost_items : match.found_items;
          const otherItem = isMyLost ? match.found_items : match.lost_items;
          
          // Release Request logic
          const requests = match.item_release_requests || [];
          const currentRequest = requests.length > 0 ? requests[0] : null;

          return (
            <motion.div 
              key={match.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 * i }}
              className="glass-card p-5 hover:border-border-active transition-all group relative overflow-hidden flex flex-col gap-4"
            >
              {/* Unread Indicator (mock logic) */}
              {match.status === 'pending' && !currentRequest && (
                <div className="absolute top-5 right-5 w-2.5 h-2.5 rounded-full bg-neon-green animate-pulse" />
              )}
              
              <div className="flex flex-col sm:flex-row gap-5">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-bg-dark rounded-xl flex items-center justify-center text-3xl sm:text-4xl border border-border-subtle shadow-inner flex-shrink-0">
                  {relevantItem?.category === 'electronics' ? '📱' : relevantItem?.category === 'bag' ? '🎒' : relevantItem?.category === 'keys' ? '🔑' : '📦'}
                </div>
                
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="flex items-center gap-1.5 text-[10px] font-bold tracking-wider uppercase bg-neon-green/10 text-neon-green px-2 py-0.5 rounded-sm">
                        <Brain className="w-3 h-3" /> AI Match Found
                      </span>
                      <span className="text-[10px] text-text-muted flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {getTimeAgo(match.created_at)}
                      </span>
                    </div>
                    
                    <h4 className="text-base font-bold text-text-primary">
                      Potential match for your {relevantItem?.category || 'item'}
                    </h4>
                    
                    <p className="text-sm text-text-secondary mt-1">
                      A similar {otherItem?.category || 'item'} was {isMyLost ? 'found' : 'lost'} near <span className="text-text-primary">{otherItem?.location_text}</span>.
                    </p>
                  </div>
                  
                  <div className="flex flex-wrap items-center justify-between gap-4 mt-4 pt-4 border-t border-border-subtle">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-bg-dark border border-neon-green/30 flex items-center justify-center text-neon-green font-bold text-xs shadow-[0_0_10px_rgba(57,255,136,0.15)]">
                        {Math.round(match.total_score)}%
                      </div>
                      <span className="text-xs font-medium text-text-secondary">Confidence Score</span>
                    </div>
                    
                    <Link 
                      to={`/matches/${match.id}`} 
                      className="btn-secondary py-2 px-4 text-xs flex items-center gap-2"
                    >
                      View Match <ChevronRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Handover Request Section (Owner Side - Display OTP) */}
              {currentRequest && isMyLost && (
                <div className="bg-bg-dark border border-border-subtle rounded-xl p-4 mt-2">
                  {currentRequest.status === 'WAITING_FOR_OWNER_OTP' && (
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                         <div className="text-orange text-sm font-medium flex items-center gap-2">
                           <KeyRound className="w-4 h-4" /> Handover Verification Required
                         </div>
                      </div>
                      <p className="text-xs text-text-secondary">A found-item user is requesting authorization to return this item.</p>
                      <div className="bg-orange/10 border border-orange/30 p-3 rounded-lg text-center">
                        <p className="text-xs text-text-muted mb-1">Your 6-digit release OTP:</p>
                        <p className="font-mono text-2xl tracking-[0.3em] font-bold text-orange">{currentRequest.raw_otp}</p>
                        <p className="text-[10px] text-text-muted mt-2">Share this OTP with the finder only if you want to authorize the item release.</p>
                      </div>
                    </div>
                  )}
                  {currentRequest.status === 'RELEASE_AUTHORIZED' && (
                    <div className="text-neon-green text-sm font-bold flex items-center gap-2 bg-neon-green/10 p-3 rounded-lg border border-neon-green/20">
                      <CheckCircle2 className="w-5 h-5" /> Handover Authorized
                    </div>
                  )}
                </div>
              )}

              {/* Handover Request Section (Finder Side) */}
              {currentRequest && !isMyLost && (
                <div className="bg-bg-dark border border-border-subtle rounded-xl p-4 mt-2">
                  {currentRequest.status === 'WAITING_FOR_OWNER_OTP' && (
                    <div className="text-text-secondary text-sm font-medium flex items-center gap-2">
                      <Clock className="w-4 h-4 text-cyan" /> Waiting for you to enter the owner's OTP...
                    </div>
                  )}
                  {currentRequest.status === 'RELEASE_AUTHORIZED' && (
                    <div className="text-neon-green text-sm font-bold flex items-center gap-2 bg-neon-green/10 p-3 rounded-lg border border-neon-green/20">
                      <CheckCircle2 className="w-5 h-5" /> Item Release Authorized
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default Messages;
