import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Brain, Search, MapPin, ShieldCheck, Zap } from 'lucide-react';

const Home = () => {
  return (
    <div className="container mx-auto px-6 lg:px-12 pt-12 pb-24">
      {/* Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        {/* Left Content */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col gap-8"
        >
          {/* Badges */}
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2 bg-neon-green/10 border border-neon-green/30 text-neon-green px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase shadow-[0_0_10px_rgba(57,255,136,0.15)]">
              <Zap className="w-3 h-3" />
              Multimodal AI Matcher
            </div>
            <div className="flex items-center gap-2 bg-orange/10 border border-orange/30 text-orange px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase">
              <ShieldCheck className="w-3 h-3" />
              Safe Handover
            </div>
          </div>

          {/* Typography */}
          <h1 className="text-5xl md:text-7xl font-heading font-extrabold tracking-tight leading-[1.1]">
            <span className="text-text-primary block">Lost. Found.</span>
            <span className="text-gradient block mt-2">Reunited.</span>
          </h1>

          <p className="text-xl md:text-2xl font-medium text-text-secondary leading-snug max-w-xl">
            "I lost something. Someone found it. <span className="text-neon-green">FindBack</span> brings them together."
          </p>
          
          <p className="text-text-muted text-base max-w-lg leading-relaxed">
            Transforming scattered campus reports into intelligent, privacy-preserving AI recovery.
          </p>

          {/* Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-4">
            <Link to="/report-lost" className="btn-primary flex items-center gap-2 text-lg px-8 py-4">
              <Search className="w-5 h-5" /> Report Lost Item
            </Link>
            <Link to="/report-found" className="btn-secondary flex items-center gap-2 text-lg px-8 py-4">
              <MapPin className="w-5 h-5" /> Report Found Item
            </Link>
            <Link to="/ai-engine" className="btn-glass flex items-center gap-2 text-lg px-8 py-4 border-border-active">
              <Brain className="w-5 h-5 text-neon-green" /> Try AI Matcher
            </Link>
          </div>
        </motion.div>

        {/* Right Content - AI Visual */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative h-[500px] flex items-center justify-center"
        >
          {/* Central AI Brain */}
          <div className="relative z-10 w-48 h-48 rounded-full bg-neon-green/5 border border-neon-green/40 flex items-center justify-center shadow-[0_0_50px_rgba(57,255,136,0.2)] animate-pulse-slow">
            <div className="w-32 h-32 rounded-full bg-neon-green/10 flex items-center justify-center blur-[2px]">
              <Brain className="w-20 h-20 text-neon-green drop-shadow-[0_0_15px_rgba(57,255,136,0.8)]" />
            </div>
          </div>

          {/* Floating Nodes */}
          <motion.div className="absolute top-10 left-10 glass-card p-4 flex items-center gap-3 animate-float" style={{ animationDelay: '0s' }}>
            <div className="w-10 h-10 rounded-full bg-orange/20 flex items-center justify-center text-orange"><MapPin /></div>
            <div>
              <p className="text-sm font-bold text-text-primary">Backpack</p>
              <p className="text-xs text-text-muted">North Block</p>
            </div>
          </motion.div>

          <motion.div className="absolute bottom-20 left-4 glass-card p-4 flex items-center gap-3 animate-float" style={{ animationDelay: '2s' }}>
            <div className="w-10 h-10 rounded-full bg-cyan/20 flex items-center justify-center text-cyan"><ShieldCheck /></div>
            <div>
              <p className="text-sm font-bold text-text-primary">Keys</p>
              <p className="text-xs text-text-muted">Canteen</p>
            </div>
          </motion.div>

          <motion.div className="absolute top-24 right-4 glass-card p-4 flex items-center gap-3 animate-float" style={{ animationDelay: '1s' }}>
            <div className="w-10 h-10 rounded-full bg-secondary-green/20 flex items-center justify-center text-secondary-green"><Search /></div>
            <div>
              <p className="text-sm font-bold text-text-primary">Phone</p>
              <p className="text-xs text-text-muted">Library</p>
            </div>
          </motion.div>

          {/* Live Status Overlay */}
          <div className="absolute -bottom-6 right-10 glass-card p-5 border-neon-green/30 max-w-xs z-20">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-3 h-3 rounded-full bg-neon-green animate-pulse shadow-[0_0_10px_rgba(57,255,136,1)]" />
              <h3 className="text-sm font-bold text-neon-green tracking-wide">Live Campus AI Matching Active</h3>
            </div>
            <p className="text-xs text-text-secondary">Analyzing text embeddings, vision vectors, location proximity & timestamps.</p>
          </div>

          {/* Background Circles/Connections */}
          <div className="absolute inset-0 border border-neon-green/10 rounded-full w-[450px] h-[450px] m-auto animate-[spin_60s_linear_infinite]" />
          <div className="absolute inset-0 border border-cyan/10 rounded-full w-[350px] h-[350px] m-auto animate-[spin_40s_linear_infinite_reverse]" />
        </motion.div>
      </div>

      {/* Statistics Section */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="mt-24 glass-card p-8 md:p-12"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-border-subtle/50 text-center">
          <div className="flex flex-col gap-2">
            <span className="text-4xl md:text-5xl font-heading font-bold text-neon-green drop-shadow-[0_0_10px_rgba(57,255,136,0.3)]">93%</span>
            <span className="text-xs font-bold tracking-widest text-text-muted uppercase">Match Precision</span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-4xl md:text-5xl font-heading font-bold text-neon-green drop-shadow-[0_0_10px_rgba(57,255,136,0.3)]">18m</span>
            <span className="text-xs font-bold tracking-widest text-text-muted uppercase">Avg Recovery Time</span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-4xl md:text-5xl font-heading font-bold text-neon-green drop-shadow-[0_0_10px_rgba(57,255,136,0.3)]">142</span>
            <span className="text-xs font-bold tracking-widest text-text-muted uppercase">Items Reunited</span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-4xl md:text-5xl font-heading font-bold text-neon-green drop-shadow-[0_0_10px_rgba(57,255,136,0.3)]">0%</span>
            <span className="text-xs font-bold tracking-widest text-text-muted uppercase">Fraud Claims</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Home;
