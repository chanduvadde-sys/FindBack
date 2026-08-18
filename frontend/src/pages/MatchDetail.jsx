import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ArrowLeft, MapPin, Clock, ShieldCheck, MessageSquare, Handshake, CheckCircle2, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ProgressBar = ({ label, percentage }) => (
  <div className="flex flex-col gap-1.5">
    <div className="flex justify-between text-sm font-medium">
      <span className="text-text-secondary">{label}</span>
      <span className="text-neon-green">{percentage}%</span>
    </div>
    <div className="h-1.5 w-full bg-bg-dark rounded-full overflow-hidden border border-border-subtle">
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 1, delay: 0.2 }}
        className="h-full bg-gradient-to-r from-secondary-green to-neon-green rounded-full shadow-[0_0_10px_rgba(57,255,136,0.5)]"
      />
    </div>
  </div>
);

const MatchDetail = () => {
  const { id } = useParams(); // match id
  const { token, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [matchData, setMatchData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Handover Modal State
  const [showModal, setShowModal] = useState(false);
  const [step, setStep] = useState(1); // 1: Account, 2: Ownership, 3: Success

  // Form states
  const [otpCode, setOtpCode] = useState('');
  const [privateDetail, setPrivateDetail] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Handover Status from DB
  const [handoverStatus, setHandoverStatus] = useState(null); // 'pending', 'accepted', 'declined'

  useEffect(() => {
    fetchMatch();
  }, [id, token]);

  const fetchMatch = async () => {
    try {
      // Fetch user's messages to find this match
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/my-messages`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        const foundMatch = data.messages.find(m => m.id === id);
        if (foundMatch) {
          setMatchData(foundMatch);
          // Wait, 'status' on matches is something else, we need handover request status.
          // For now, if we don't have it locally in the join, we can fetch it or just rely on global state.
          // Let's assume there's a separate endpoint, or we just rely on `messages` having it if we modified the backend.
          // But I didn't join `handover_requests` in `/api/my-messages`. 
          // So I will just check if `foundMatch.handover_requests` exists.
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const initiateHandover = async () => {
    setShowModal(true);
    setStep(1);
    setErrorMsg('');
    try {
      await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/verify-account/send-otp`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleVerifyOtp = async () => {
    setVerifying(true);
    setErrorMsg('');
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/verify-account/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ code: otpCode })
      });
      const data = await res.json();
      if (data.success) {
        setStep(2);
        setOtpCode('');
      } else {
        setErrorMsg(data.error || 'Invalid verification code');
      }
    } catch (e) {
      setErrorMsg('Network error');
    }
    setVerifying(false);
  };

  const handleVerifyOwnership = async () => {
    setVerifying(true);
    setErrorMsg('');
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/verify-ownership`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ matchId: id, privateDetail })
      });
      const data = await res.json();
      if (data.success) {
        setStep(3);
      } else {
        setErrorMsg(data.error || 'Ownership verification failed');
      }
    } catch (e) {
      setErrorMsg('Network error');
    }
    setVerifying(false);
  };

  const handleFinalRequest = async () => {
    setVerifying(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/handover/request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ matchId: id })
      });
      const data = await res.json();
      if (data.success) {
        setHandoverStatus('pending');
        setShowModal(false);
      } else {
        setErrorMsg(data.error);
      }
    } catch (e) {
      setErrorMsg('Network error');
    }
    setVerifying(false);
  };

  if (loading) return <div className="text-center py-20 text-neon-green">Loading...</div>;
  if (!matchData) return <div className="text-center py-20 text-text-secondary">Match not found.</div>;

  const isRequester = matchData.lost_items.user_id === user.id;

  return (
    <div className="container mx-auto px-6 lg:px-12 py-8 flex flex-col gap-8 relative">
      
      {/* Header */}
      <div>
        <Link to="/profile/messages" className="inline-flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors mb-6 bg-bg-glass border border-border-subtle px-4 py-2 rounded-full">
          <ArrowLeft className="w-4 h-4" /> Back to Messages
        </Link>
      </div>

      {/* Top Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
        {/* Lost Item */}
        <div className="glass-card p-6 flex flex-col gap-4">
          <div>
            <span className="text-[10px] font-bold text-orange tracking-widest uppercase">Lost Item</span>
            <h2 className="text-2xl font-bold text-text-primary mt-1">{matchData.lost_items.category}</h2>
            <div className="flex items-center gap-2 text-xs text-text-muted mt-2">
              <MapPin className="w-3 h-3" /> {matchData.lost_items.location_text}
            </div>
            <div className="flex items-center gap-2 text-xs text-text-muted mt-1">
              <Clock className="w-3 h-3" /> {new Date(matchData.lost_items.lost_at).toLocaleDateString()}
            </div>
          </div>
          <div className="h-48 bg-bg-dark rounded-xl border border-border-subtle flex items-center justify-center text-5xl shadow-inner">
            🔍
          </div>
        </div>

        {/* Center - Match Score */}
        <div className="flex flex-col items-center justify-center py-8 lg:py-0">
          <div className="relative w-48 h-48 flex items-center justify-center mb-6">
            <svg className="absolute inset-0 w-full h-full transform -rotate-90">
              <circle cx="96" cy="96" r="88" stroke="rgba(255,255,255,0.05)" strokeWidth="4" fill="none" />
              <motion.circle 
                cx="96" cy="96" r="88" 
                stroke="#39FF88" strokeWidth="4" fill="none" 
                strokeDasharray="552.9" strokeDashoffset="552.9"
                animate={{ strokeDashoffset: 552.9 - (552.9 * (matchData.total_score / 100)) }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                strokeLinecap="round"
                className="drop-shadow-[0_0_15px_rgba(57,255,136,0.6)]"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl font-heading font-bold text-text-primary drop-shadow-[0_0_10px_rgba(57,255,136,0.3)]">{Math.round(matchData.total_score)}%</span>
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest mt-1">Match Score</span>
            </div>
          </div>
          
          <div className="bg-neon-green/10 border border-neon-green/30 text-neon-green px-4 py-2 rounded-full flex items-center gap-2 text-sm font-bold shadow-[0_0_15px_rgba(57,255,136,0.15)]">
            <ShieldCheck className="w-4 h-4" /> AI Verified
          </div>
        </div>

        {/* Found Item */}
        <div className="glass-card p-6 flex flex-col gap-4">
          <div>
            <span className="text-[10px] font-bold text-neon-green tracking-widest uppercase">Matched Item</span>
            <h2 className="text-2xl font-bold text-text-primary mt-1">{matchData.found_items.category}</h2>
            <div className="flex items-center gap-2 text-xs text-text-muted mt-2">
              <MapPin className="w-3 h-3" /> {matchData.found_items.location_text}
            </div>
            <div className="flex items-center gap-2 text-xs text-text-muted mt-1">
              <Clock className="w-3 h-3" /> {new Date(matchData.found_items.found_at).toLocaleDateString()}
            </div>
          </div>
          <div className="h-48 bg-bg-dark rounded-xl border border-border-subtle flex items-center justify-center text-5xl shadow-inner">
            ✨
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* AI Analysis */}
        <div className="glass-card p-6 flex flex-col gap-6">
          <h3 className="text-sm font-bold text-text-secondary tracking-widest uppercase mb-2">AI Match Analysis</h3>
          <ProgressBar label="Category Similarity" percentage={Math.round(matchData.category_score)} />
          <ProgressBar label="Text Similarity" percentage={Math.round(matchData.text_score)} />
          <ProgressBar label="Location Proximity" percentage={Math.round(matchData.location_score)} />
          <ProgressBar label="Time Proximity" percentage={Math.round(matchData.time_score)} />
        </div>

        {/* Comparison Table */}
        <div className="glass-card p-6 flex flex-col gap-6">
          <h3 className="text-sm font-bold text-text-secondary tracking-widest uppercase mb-2">Item Details Comparison</h3>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border-subtle">
                  <th className="pb-3 text-text-muted font-medium w-1/3">Property</th>
                  <th className="pb-3 text-text-secondary font-medium w-1/3">Lost Item</th>
                  <th className="pb-3 text-neon-green font-medium w-1/3">Found Item</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle/50">
                <tr>
                  <td className="py-3 text-text-muted">Color</td>
                  <td className="py-3 text-text-primary">{matchData.lost_items.color || 'N/A'}</td>
                  <td className="py-3 text-text-primary">{matchData.found_items.color || 'N/A'}</td>
                </tr>
                <tr>
                  <td className="py-3 text-text-muted">Desc</td>
                  <td className="py-3 text-text-primary truncate max-w-[100px]">{matchData.lost_items.description || 'N/A'}</td>
                  <td className="py-3 text-text-primary truncate max-w-[100px]">{matchData.found_items.description || 'N/A'}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Next Steps */}
        <div className="glass-card p-6 flex flex-col gap-6">
          <h3 className="text-sm font-bold text-text-secondary tracking-widest uppercase mb-2">Next Steps</h3>
          
          <div className="flex flex-col gap-4 flex-1">
            <div className="flex items-start gap-4 p-4 rounded-xl bg-bg-dark border border-border-subtle">
              <div className="p-2 rounded-lg bg-orange/10 text-orange"><MessageSquare className="w-5 h-5" /></div>
              <div>
                <h4 className="text-sm font-bold text-text-primary">Contact Finder</h4>
                <p className="text-xs text-text-muted mt-1">Send secure message without exposing private data.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4 p-4 rounded-xl bg-bg-dark border border-border-subtle">
              <div className="p-2 rounded-lg bg-cyan/10 text-cyan"><ShieldCheck className="w-5 h-5" /></div>
              <div>
                <h4 className="text-sm font-bold text-text-primary">Verify Ownership</h4>
                <p className="text-xs text-text-muted mt-1">2-Factor Handover verification required.</p>
              </div>
            </div>
          </div>

          {handoverStatus === 'pending' ? (
            <div className="bg-orange/10 border border-orange/30 text-orange w-full py-3 rounded-lg text-center font-medium">
              Handover Requested - Pending Finder
            </div>
          ) : isRequester ? (
            <button onClick={initiateHandover} className="btn-primary w-full flex items-center justify-center gap-2 mt-auto">
              <Handshake className="w-5 h-5" /> Request Handover
            </button>
          ) : (
            <div className="bg-bg-dark border border-border-subtle text-text-secondary w-full py-3 rounded-lg text-center font-medium">
              Waiting for owner to request handover
            </div>
          )}
        </div>

      </div>

      {/* SECURE 2-FACTOR HANDOVER MODAL */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setShowModal(false)}
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="glass-card w-full max-w-md relative z-10 overflow-hidden"
            >
              {/* Header */}
              <div className="p-6 border-b border-border-subtle">
                <h2 className="text-xl font-heading font-bold text-text-primary">Secure Handover Verification</h2>
                <p className="text-sm text-text-muted mt-1">To protect both users, FindBack requires two verification steps before requesting a handover.</p>
                
                {/* Stepper */}
                <div className="flex items-center gap-2 mt-6">
                  <div className={`h-1 flex-1 rounded-full ${step >= 1 ? 'bg-neon-green shadow-[0_0_10px_rgba(57,255,136,0.5)]' : 'bg-border-subtle'}`} />
                  <div className={`h-1 flex-1 rounded-full ${step >= 2 ? 'bg-neon-green shadow-[0_0_10px_rgba(57,255,136,0.5)]' : 'bg-border-subtle'}`} />
                  <div className={`h-1 flex-1 rounded-full ${step >= 3 ? 'bg-neon-green shadow-[0_0_10px_rgba(57,255,136,0.5)]' : 'bg-border-subtle'}`} />
                </div>
                <div className="flex justify-between text-[10px] font-bold tracking-widest uppercase mt-2 text-text-muted">
                  <span className={step >= 1 ? 'text-neon-green' : ''}>01 Account</span>
                  <span className={step >= 2 ? 'text-neon-green' : ''}>02 Ownership</span>
                  <span className={step >= 3 ? 'text-neon-green' : ''}>03 Handover</span>
                </div>
              </div>

              {/* Body */}
              <div className="p-6">
                {errorMsg && (
                  <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-lg text-sm mb-4">
                    {errorMsg}
                  </div>
                )}

                {step === 1 && (
                  <div className="flex flex-col gap-4">
                    <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
                      <ShieldCheck className="text-cyan w-5 h-5" /> Verify Your Account
                    </h3>
                    <p className="text-sm text-text-secondary">We've generated a secure 6-digit code for your account. (Check your backend database/logs).</p>
                    <input 
                      type="text" 
                      placeholder="Enter verification code" 
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      className="w-full bg-bg-dark border border-border-subtle rounded-lg py-3 px-4 text-center tracking-[0.5em] font-mono text-lg text-text-primary focus:outline-none focus:border-cyan/50"
                    />
                    <div className="flex gap-3 mt-2">
                      <button onClick={() => setShowModal(false)} className="btn-glass flex-1">Cancel</button>
                      <button onClick={handleVerifyOtp} disabled={verifying || !otpCode} className="btn-primary flex-1 bg-cyan text-bg-dark hover:shadow-[0_0_20px_rgba(0,255,255,0.4)]">
                        {verifying ? 'Verifying...' : 'Verify'}
                      </button>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="flex flex-col gap-4">
                    <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
                      <ShieldCheck className="text-neon-green w-5 h-5" /> Verify Item Ownership
                    </h3>
                    <p className="text-sm text-text-secondary">Enter the private detail about your item that was not publicly displayed in the report.</p>
                    <input 
                      type="text" 
                      placeholder="Private ownership detail" 
                      value={privateDetail}
                      onChange={(e) => setPrivateDetail(e.target.value)}
                      className="w-full bg-bg-dark border border-border-subtle rounded-lg py-3 px-4 text-sm text-text-primary focus:outline-none focus:border-neon-green/50"
                    />
                    <div className="flex gap-3 mt-2">
                      <button onClick={() => setShowModal(false)} className="btn-glass flex-1">Cancel</button>
                      <button onClick={handleVerifyOwnership} disabled={verifying || !privateDetail} className="btn-primary flex-1">
                        {verifying ? 'Verifying...' : 'Verify Ownership'}
                      </button>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="flex flex-col gap-4 items-center text-center">
                    <div className="w-16 h-16 bg-neon-green/10 border border-neon-green/30 text-neon-green rounded-full flex items-center justify-center mb-2 shadow-[0_0_30px_rgba(57,255,136,0.2)]">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-text-primary">Ready to Request Handover</h3>
                    <p className="text-sm text-text-secondary">Both verification steps are complete. You can now request a safe handover from the finder.</p>
                    
                    <div className="w-full bg-bg-dark rounded-lg p-4 border border-border-subtle flex flex-col gap-2 text-left mt-2">
                      <div className="flex items-center gap-2 text-sm text-text-primary">
                        <CheckCircle2 className="w-4 h-4 text-neon-green" /> Account Verified
                      </div>
                      <div className="flex items-center gap-2 text-sm text-text-primary">
                        <CheckCircle2 className="w-4 h-4 text-neon-green" /> Ownership Verified
                      </div>
                    </div>

                    <div className="flex gap-3 mt-4 w-full">
                      <button onClick={() => setShowModal(false)} className="btn-glass flex-1">Cancel</button>
                      <button onClick={handleFinalRequest} disabled={verifying} className="btn-primary flex-1">
                        {verifying ? 'Requesting...' : 'Request Handover'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default MatchDetail;
