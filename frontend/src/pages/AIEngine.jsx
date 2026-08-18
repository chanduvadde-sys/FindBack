import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Eye, Map, Clock, Network, Headphones, Search, Link } from 'lucide-react';

const ProcessingStage = ({ icon: Icon, title, desc, active, delay }) => (
  <motion.div 
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.5, delay }}
    className="flex items-start gap-4 p-3"
  >
    <div className={`mt-1 flex-shrink-0 w-3 h-3 rounded-full ${active ? 'bg-neon-green animate-pulse shadow-[0_0_10px_rgba(57,255,136,0.8)]' : 'bg-border-subtle'}`} />
    <div>
      <h4 className={`text-sm font-bold ${active ? 'text-text-primary' : 'text-text-secondary'}`}>{title}</h4>
      <p className="text-xs text-text-muted mt-1">{desc}</p>
    </div>
  </motion.div>
);

const ActivityItem = ({ title, item, time, delay, icon: Icon }) => (
  <motion.div 
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.5, delay }}
    className="flex items-center gap-4 py-3 border-b border-border-subtle last:border-0"
  >
    <div className="w-10 h-10 rounded-lg bg-bg-dark flex items-center justify-center border border-border-subtle text-text-secondary">
      {Icon ? <Icon className="w-5 h-5" /> : <Search className="w-5 h-5" />}
    </div>
    <div className="flex-1">
      <h4 className="text-xs font-bold text-neon-green">{title}</h4>
      <p className="text-sm font-medium text-text-primary truncate w-32">{item}</p>
    </div>
    <span className="text-xs font-medium text-text-muted">{time}</span>
  </motion.div>
);

const MapNode = ({ top, left, label, pulseDelay }) => (
  <div className="absolute flex flex-col items-center gap-2" style={{ top, left }}>
    <div className="relative flex items-center justify-center">
      <div 
        className="absolute w-8 h-8 rounded-full bg-neon-green/20"
        style={{ animation: `pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite ${pulseDelay}s` }}
      />
      <div className="w-3 h-3 rounded-full bg-neon-green relative z-10 shadow-[0_0_15px_rgba(57,255,136,1)]" />
    </div>
    <span className="text-xs font-bold text-text-primary drop-shadow-md whitespace-nowrap">{label}</span>
  </div>
);

const AIEngine = () => {
  return (
    <div className="container mx-auto px-6 lg:px-12 py-8 flex flex-col h-[calc(100vh-8rem)] min-h-[700px] gap-6">
      
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-heading font-bold text-text-primary">Live Campus AI Engine</h1>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 flex-1 h-full">
        {/* Left Panel - Processing */}
        <div className="w-full lg:w-72 flex flex-col gap-6">
          <div className="glass-card p-6 flex-1">
            <h2 className="text-sm font-bold tracking-widest text-text-muted uppercase mb-6">Processing Stages</h2>
            <div className="flex flex-col relative before:absolute before:left-4 before:top-4 before:bottom-4 before:w-px before:bg-border-subtle before:-z-10">
              <ProcessingStage icon={Zap} title="Real-time Analysis" desc="Processing campus reports" active delay={0.1} />
              <ProcessingStage icon={Eye} title="Vision Embedding" desc="Extracting visual features" active delay={0.3} />
              <ProcessingStage icon={Map} title="Location Mapping" desc="Mapping proximity" active delay={0.5} />
              <ProcessingStage icon={Clock} title="Temporal Analysis" desc="Analyzing time patterns" active delay={0.7} />
              <ProcessingStage icon={Network} title="Match Generation" desc="Finding best matches" active={false} delay={0.9} />
            </div>
          </div>
          
          {/* Efficiency Card */}
          <div className="glass-card p-6 flex flex-col items-center justify-center gap-4">
            <h2 className="text-sm font-bold tracking-widest text-text-muted uppercase self-start w-full text-left">Engine Performance</h2>
            <div className="relative w-32 h-32 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="64" cy="64" r="56" stroke="rgba(255,255,255,0.05)" strokeWidth="8" fill="none" />
                <motion.circle 
                  cx="64" cy="64" r="56" 
                  stroke="#39FF88" strokeWidth="8" fill="none" 
                  strokeDasharray="351.8" strokeDashoffset="351.8"
                  animate={{ strokeDashoffset: 351.8 - (351.8 * 0.98) }}
                  transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-heading font-bold text-text-primary">98%</span>
                <span className="text-[9px] font-bold text-text-muted uppercase tracking-wider">Efficiency</span>
              </div>
            </div>
          </div>
        </div>

        {/* Center Map */}
        <div className="flex-1 glass-card overflow-hidden relative min-h-[400px]">
          {/* Background Grid */}
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5" />
          <div className="absolute inset-0 bg-gradient-to-br from-neon-green/5 via-transparent to-cyan/5" />
          
          <MapNode top="20%" left="30%" label="North Block" pulseDelay={0} />
          <MapNode top="35%" left="65%" label="Canteen" pulseDelay={1.5} />
          <MapNode top="55%" left="50%" label="Library" pulseDelay={0.5} />
          <MapNode top="70%" left="25%" label="Auditorium" pulseDelay={2} />
          <MapNode top="80%" left="55%" label="Parking Area" pulseDelay={1} />
          <MapNode top="75%" left="80%" label="Hostel Block" pulseDelay={0.8} />

          {/* Animated Connecting Lines (SVG) */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <motion.path 
              d="M 30% 20% L 50% 55%" 
              stroke="rgba(57,255,136,0.3)" 
              strokeWidth="2" 
              strokeDasharray="5,5" 
              fill="none" 
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
            />
            <motion.path 
              d="M 50% 55% L 65% 35%" 
              stroke="rgba(57,255,136,0.3)" 
              strokeWidth="2" 
              strokeDasharray="5,5" 
              fill="none" 
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1.5, repeat: Infinity, repeatType: 'reverse', delay: 1 }}
            />
             <motion.path 
              d="M 25% 70% L 50% 55%" 
              stroke="rgba(57,255,136,0.3)" 
              strokeWidth="2" 
              strokeDasharray="5,5" 
              fill="none" 
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 2.5, repeat: Infinity, repeatType: 'reverse', delay: 0.5 }}
            />
          </svg>
        </div>

        {/* Right Panel - Activity Feed */}
        <div className="w-full lg:w-72 flex flex-col gap-6">
          <div className="glass-card p-6 flex-1 overflow-hidden flex flex-col">
            <h2 className="text-sm font-bold tracking-widest text-text-muted uppercase mb-4">Live Activity Feed</h2>
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar flex flex-col">
              <ActivityItem title="New Report" item="Black Wallet" time="2m ago" delay={0.1} />
              <ActivityItem title="New Match" item="iPhone 13" time="5m ago" icon={Link} delay={0.2} />
              <ActivityItem title="New Report" item="Water Bottle" time="7m ago" delay={0.3} />
              <ActivityItem title="Match Confirmed" item="Keychain" time="10m ago" icon={Link} delay={0.4} />
              <ActivityItem title="New Report" item="Headphones" time="12m ago" icon={Headphones} delay={0.5} />
            </div>
          </div>
          
          <div className="glass-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-text-secondary flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-neon-green animate-pulse" /> Active Matches
                </h2>
                <span className="text-4xl font-heading font-bold text-text-primary mt-2 block">24</span>
                <span className="text-xs font-medium text-neon-green">Live Now</span>
              </div>
              
              {/* Mini Sparkline Chart representation */}
              <div className="w-24 h-12 flex items-end justify-between gap-1">
                {[4, 6, 8, 5, 9, 12, 10].map((h, i) => (
                  <motion.div 
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${h * 8}%` }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className="w-2 bg-gradient-to-t from-neon-green/10 to-neon-green rounded-t-sm"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AIEngine;
