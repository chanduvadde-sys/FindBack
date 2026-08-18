import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Clock, ShieldCheck, MessageSquare, Handshake } from 'lucide-react';
import { Link } from 'react-router-dom';

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
  return (
    <div className="container mx-auto px-6 lg:px-12 py-8 flex flex-col gap-8">
      
      {/* Header */}
      <div>
        <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors mb-6 bg-bg-glass border border-border-subtle px-4 py-2 rounded-full">
          <ArrowLeft className="w-4 h-4" /> Back to Matches
        </Link>
      </div>

      {/* Top Section - Side by Side Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
        
        {/* Lost Item */}
        <div className="glass-card p-6 flex flex-col gap-4">
          <div>
            <span className="text-[10px] font-bold text-orange tracking-widest uppercase">Lost Item</span>
            <h2 className="text-2xl font-bold text-text-primary mt-1">Black College Bag</h2>
            <div className="flex items-center gap-2 text-xs text-text-muted mt-2">
              <MapPin className="w-3 h-3" /> North Block, 2nd Floor
            </div>
            <div className="flex items-center gap-2 text-xs text-text-muted mt-1">
              <Clock className="w-3 h-3" /> Reported 2h ago
            </div>
          </div>
          <div className="h-64 bg-bg-dark rounded-xl border border-border-subtle flex items-center justify-center text-7xl shadow-inner">
            🎒
          </div>
        </div>

        {/* Center - Match Score */}
        <div className="flex flex-col items-center justify-center py-8 lg:py-0">
          <div className="relative w-48 h-48 flex items-center justify-center mb-6">
            <svg className="absolute inset-0 w-full h-full transform -rotate-90">
              <circle cx="96" cy="96" r="88" stroke="rgba(255,255,255,0.05)" strokeWidth="4" fill="none" />
              <circle cx="96" cy="96" r="76" stroke="rgba(255,255,255,0.05)" strokeWidth="1" fill="none" strokeDasharray="4 4" />
              <motion.circle 
                cx="96" cy="96" r="88" 
                stroke="#39FF88" strokeWidth="4" fill="none" 
                strokeDasharray="552.9" strokeDashoffset="552.9"
                animate={{ strokeDashoffset: 552.9 - (552.9 * 0.93) }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                strokeLinecap="round"
                className="drop-shadow-[0_0_15px_rgba(57,255,136,0.6)]"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl font-heading font-bold text-text-primary drop-shadow-[0_0_10px_rgba(57,255,136,0.3)]">93%</span>
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest mt-1">Match Score</span>
            </div>
          </div>
          
          <div className="bg-neon-green/10 border border-neon-green/30 text-neon-green px-4 py-2 rounded-full flex items-center gap-2 text-sm font-bold shadow-[0_0_15px_rgba(57,255,136,0.15)]">
            <ShieldCheck className="w-4 h-4" /> High Confidence Match
          </div>
        </div>

        {/* Found Item */}
        <div className="glass-card p-6 flex flex-col gap-4">
          <div>
            <span className="text-[10px] font-bold text-neon-green tracking-widest uppercase">Matched Item</span>
            <h2 className="text-2xl font-bold text-text-primary mt-1">Similar Black Bag</h2>
            <div className="flex items-center gap-2 text-xs text-text-muted mt-2">
              <MapPin className="w-3 h-3" /> Near Auditorium
            </div>
            <div className="flex items-center gap-2 text-xs text-text-muted mt-1">
              <Clock className="w-3 h-3" /> Found 1h ago
            </div>
          </div>
          <div className="h-64 bg-bg-dark rounded-xl border border-border-subtle flex items-center justify-center text-7xl shadow-inner">
            🎒
          </div>
        </div>

      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* AI Analysis */}
        <div className="glass-card p-6 flex flex-col gap-6">
          <h3 className="text-sm font-bold text-text-secondary tracking-widest uppercase mb-2">AI Match Analysis</h3>
          <ProgressBar label="Visual Similarity" percentage={96} />
          <ProgressBar label="Text Similarity" percentage={91} />
          <ProgressBar label="Location Proximity" percentage={94} />
          <ProgressBar label="Time Proximity" percentage={88} />
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
                  <td className="py-3 text-text-primary">Black</td>
                  <td className="py-3 text-text-primary">Black</td>
                </tr>
                <tr>
                  <td className="py-3 text-text-muted">Type</td>
                  <td className="py-3 text-text-primary">Backpack</td>
                  <td className="py-3 text-text-primary">Backpack</td>
                </tr>
                <tr>
                  <td className="py-3 text-text-muted">Brand</td>
                  <td className="py-3 text-text-primary">Safari</td>
                  <td className="py-3 text-text-primary">Safari</td>
                </tr>
                <tr>
                  <td className="py-3 text-text-muted">Material</td>
                  <td className="py-3 text-text-primary">Polyester</td>
                  <td className="py-3 text-text-primary">Polyester</td>
                </tr>
                <tr>
                  <td className="py-3 text-text-muted">Zippers</td>
                  <td className="py-3 text-text-primary">3</td>
                  <td className="py-3 text-text-primary">3</td>
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
                <p className="text-xs text-text-muted mt-1">Verify hidden item details to confirm ownership.</p>
              </div>
            </div>
          </div>

          <button className="btn-primary w-full flex items-center justify-center gap-2 mt-auto">
            <Handshake className="w-5 h-5" /> Request Handover
          </button>
        </div>

      </div>

    </div>
  );
};

export default MatchDetail;
