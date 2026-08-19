import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ShieldCheck, CheckCircle2, ChevronRight, X, User, KeyRound } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { useContext } from 'react';

const MatchDetail = () => {
  const { id } = useParams();
  const { token, user } = useContext(AuthContext);
  const [matchData, setMatchData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  // OTP State (6 digits)
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef([]);

  useEffect(() => {
    fetchMatchDetails();
  }, [id]);

  const fetchMatchDetails = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/my-messages`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        const foundMatch = data.messages.find(m => m.id.toString() === id.toString());
        if (foundMatch) {
          setMatchData(foundMatch);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestVerification = async () => {
    try {
      setVerifying(true);
      setErrorMsg('');
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/release/request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ matchId: matchData.id })
      });
      const data = await response.json();
      if (data.success) {
        fetchMatchDetails(); // refresh to get the new request status
      } else {
        setErrorMsg(data.error || 'Failed to request owner verification.');
      }
    } catch (error) {
      setErrorMsg('Network error.');
    } finally {
      setVerifying(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) {
      // Handle paste
      const digits = value.slice(0, 6).split('');
      const newOtp = [...otp];
      digits.forEach((d, i) => {
        if (index + i < 6) newOtp[index + i] = d;
      });
      setOtp(newOtp);
      // Focus the next empty box or the last box
      const nextIndex = Math.min(index + digits.length, 5);
      inputRefs.current[nextIndex]?.focus();
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-advance
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = async () => {
    const fullOtp = otp.join('');
    if (fullOtp.length !== 6) return;
    
    try {
      setVerifying(true);
      setErrorMsg('');
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/release/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ matchId: matchData.id, otp: fullOtp })
      });
      const data = await response.json();
      if (data.success) {
        setShowModal(false);
        fetchMatchDetails(); // This will update the status to RELEASE_AUTHORIZED
      } else {
        setErrorMsg(data.error || 'Invalid OTP');
      }
    } catch (error) {
      setErrorMsg('Network error.');
    } finally {
      setVerifying(false);
    }
  };

  if (loading) return <div className="pt-24 flex justify-center text-neon-green"><div className="animate-spin w-8 h-8 border-4 border-neon-green border-t-transparent rounded-full"></div></div>;
  if (!matchData) return <div className="pt-24 text-center text-text-secondary">Match not found.</div>;

  const isFinder = user.id === matchData.found_items.user_id;
  const isOwner = user.id === matchData.lost_items.user_id;
  
  const releaseRequest = matchData.item_release_requests && matchData.item_release_requests.length > 0 
    ? matchData.item_release_requests[0] 
    : null;

  const status = releaseRequest ? releaseRequest.status : null;

  return (
    <div className="pt-24 pb-12 max-w-4xl mx-auto px-4 min-h-screen">
      <Link to="/profile/messages" className="text-text-muted hover:text-neon-green flex items-center gap-2 mb-6 transition-colors w-fit">
        <ArrowLeft className="w-4 h-4" /> Back to Messages
      </Link>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Left Side: Match Info */}
        <div className="flex-1 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-neon-green/20 border border-neon-green/50 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-neon-green" />
            </div>
            <div>
              <h1 className="text-2xl font-heading font-bold text-text-primary">AI Match Analysis</h1>
              <p className="text-text-secondary">Match ID: <span className="font-mono text-neon-green">{matchData.id}</span></p>
            </div>
          </div>

          <div className="glass-card p-6 border-neon-green/30 relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-neon-green text-bg-dark text-xs font-bold px-3 py-1 rounded-bl-lg">
              High Confidence Match
            </div>
            <h2 className="text-lg font-bold text-text-primary mb-4 border-b border-border-subtle pb-2">Item Details Comparison</h2>
            
            <div className="grid grid-cols-2 gap-x-4 gap-y-6 mt-4">
              <div>
                <p className="text-xs text-text-muted uppercase tracking-wider mb-1">Lost Item</p>
                <p className="text-text-primary font-medium">{matchData.lost_items.category}</p>
                <p className="text-sm text-text-secondary line-clamp-2">{matchData.lost_items.description}</p>
              </div>
              <div>
                <p className="text-xs text-text-muted uppercase tracking-wider mb-1">Found Item</p>
                <p className="text-text-primary font-medium">{matchData.found_items.category}</p>
                <p className="text-sm text-text-secondary line-clamp-2">{matchData.found_items.description}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Action Area */}
        <div className="w-full md:w-[350px] glass-card p-6 flex flex-col h-fit">
          <h2 className="text-xl font-heading font-bold text-text-primary mb-4">Handover Status</h2>
          
          {!releaseRequest && isFinder && (
             <div className="flex flex-col gap-4">
                <div className="bg-bg-dark border border-border-subtle rounded-lg p-4">
                  <p className="text-sm text-text-secondary mb-3">
                    AI has identified a possible match with a lost item. The item owner must verify the release before you can return it.
                  </p>
                  <button 
                    onClick={handleRequestVerification} 
                    disabled={verifying}
                    className="btn-primary w-full"
                  >
                    {verifying ? 'Requesting...' : 'Request Owner Verification'}
                  </button>
                  {errorMsg && !showModal && <p className="text-red-400 text-xs mt-2">{errorMsg}</p>}
                </div>
             </div>
          )}

          {!releaseRequest && isOwner && (
            <div className="bg-bg-dark border border-border-subtle text-text-secondary w-full p-4 rounded-lg text-center font-medium">
              Waiting for finder to request owner verification.
            </div>
          )}

          {releaseRequest && status === 'WAITING_FOR_OWNER_OTP' && isOwner && (
            <div className="flex flex-col gap-4">
              <div className="bg-orange/10 border border-orange/30 p-4 rounded-lg">
                <h3 className="text-orange font-bold flex items-center gap-2 mb-2">
                  <KeyRound className="w-4 h-4" /> Your Release OTP
                </h3>
                <p className="text-sm text-text-secondary mb-3">
                  A finder has requested to return this item. To authorize the return, provide this 6-digit OTP to the finder.
                </p>
                <div className="bg-bg-dark border border-border-subtle rounded-lg py-3 px-4 text-center tracking-[0.5em] font-mono text-2xl text-text-primary">
                  {releaseRequest.raw_otp}
                </div>
                <p className="text-xs text-text-muted mt-3 text-center">
                  Do not share this code with anyone except the person returning your item.
                </p>
              </div>
            </div>
          )}

          {releaseRequest && status === 'WAITING_FOR_OWNER_OTP' && isFinder && (
            <div className="flex flex-col gap-4">
              <div className="bg-bg-dark border border-border-subtle rounded-lg p-4 text-center">
                <p className="text-sm text-text-secondary mb-4">
                  A secure OTP has been sent to the item owner. Ask the owner for their 6-digit code to authorize the item release.
                </p>
                <button 
                  onClick={() => setShowModal(true)} 
                  className="btn-primary w-full"
                >
                  Enter OTP
                </button>
              </div>
            </div>
          )}

          {releaseRequest && status === 'LOCKED' && (
             <div className="bg-red-500/10 border border-red-500/30 text-red-400 w-full p-4 rounded-lg text-center font-medium">
               Verification Temporarily Locked
             </div>
          )}

          {releaseRequest && status === 'EXPIRED' && (
             <div className="flex flex-col gap-4">
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 w-full p-4 rounded-lg text-center font-medium mb-2">
                  OTP Expired.
                </div>
                {isFinder && (
                   <button 
                     onClick={handleRequestVerification} 
                     disabled={verifying}
                     className="btn-secondary w-full"
                   >
                     {verifying ? 'Requesting...' : 'Request New OTP'}
                   </button>
                )}
             </div>
          )}

          {releaseRequest && status === 'RELEASE_AUTHORIZED' && (
             <div className="bg-neon-green/10 border border-neon-green/30 text-neon-green w-full p-6 rounded-lg text-center flex flex-col items-center">
               <CheckCircle2 className="w-12 h-12 mb-3" />
               <h3 className="text-lg font-bold">Item Release Authorized</h3>
               <p className="text-sm text-text-primary/80 mt-2">The item owner has successfully verified the handover.</p>
               <button className="btn-secondary mt-6 w-full">Continue Handover</button>
             </div>
          )}

        </div>

      </div>

      {/* SECURE OTP HANDOVER MODAL FOR FINDER */}
      <AnimatePresence>
        {showModal && isFinder && status === 'WAITING_FOR_OWNER_OTP' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setShowModal(false)}
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }} 
              animate={{ scale: 1, opacity: 1, y: 0 }} 
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="glass-card w-full max-w-lg relative z-10 overflow-hidden"
            >
              {/* Header Badge */}
              <div className="w-full bg-neon-green/10 border-b border-neon-green/20 py-2 px-6 flex items-center gap-2 text-neon-green text-xs font-bold tracking-widest uppercase">
                <KeyRound className="w-4 h-4" /> 2-FACTOR HANDOVER OTP
              </div>

              {/* Header */}
              <div className="p-6 border-b border-border-subtle relative">
                <button onClick={() => setShowModal(false)} className="absolute top-6 right-6 text-text-muted hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
                <h2 className="text-2xl font-heading font-bold text-text-primary">Item Release OTP Verification</h2>
                <p className="text-sm text-text-secondary mt-1 font-mono uppercase tracking-wider text-neon-green/80">Secure Handover Protocol</p>
              </div>

              {/* Body */}
              <div className="p-6">
                
                {/* Item Info Box */}
                <div className="bg-bg-dark border border-border-subtle rounded-lg p-4 mb-6 flex items-start gap-4">
                   <div className="w-10 h-10 rounded bg-bg-card border border-border-subtle flex items-center justify-center text-text-muted font-bold">
                     {matchData.found_items.category.substring(0, 2).toUpperCase()}
                   </div>
                   <div>
                     <p className="text-xs text-text-muted">Item ID & Title</p>
                     <p className="text-text-primary font-bold">FB-{matchData.found_items.id} • {matchData.found_items.category} Found</p>
                     <p className="text-xs text-text-secondary mt-1">Found Location: {matchData.found_items.location_text}</p>
                   </div>
                </div>

                {errorMsg && (
                  <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-lg text-sm mb-6 text-center">
                    {errorMsg}
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-lg font-bold text-text-primary">Enter 6-Digit Handover Security OTP</h3>
                  <p className="text-sm text-text-secondary mt-2">
                    A secure OTP has been sent to the item owner. Ask the owner for their 6-digit code to authorize the item release.
                  </p>
                </div>

                {/* OTP Input Boxes */}
                <div className="flex justify-center gap-2 mb-8">
                  {otp.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={el => inputRefs.current[idx] = el}
                      type="text"
                      maxLength={6}
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(idx, e)}
                      className="w-12 h-14 bg-bg-dark border border-border-subtle rounded-lg text-center text-2xl font-mono text-neon-green focus:outline-none focus:border-neon-green focus:shadow-[0_0_15px_rgba(57,255,136,0.2)] transition-all"
                    />
                  ))}
                </div>

                <div className="flex flex-col gap-3">
                  <button 
                    onClick={handleVerifyOtp} 
                    disabled={verifying || otp.join('').length !== 6} 
                    className="btn-primary w-full bg-neon-green text-bg-dark py-3 font-bold hover:shadow-[0_0_20px_rgba(57,255,136,0.4)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
                  >
                    {verifying ? 'Verifying...' : 'Authorize Item Release'}
                  </button>
                  <button onClick={() => setShowModal(false)} className="btn-glass w-full py-3">
                    Return to FindBack Platform
                  </button>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default MatchDetail;
