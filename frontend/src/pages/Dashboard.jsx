import React from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, FileText, Search, MapPin, 
  Brain, User, MessageSquare, Activity,
  TrendingUp, Clock, AlertCircle, CheckCircle2
} from 'lucide-react';

const SidebarItem = ({ icon: Icon, label, active }) => (
  <button className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
    active 
      ? 'bg-neon-green/10 text-neon-green border border-neon-green/20' 
      : 'text-text-secondary hover:text-text-primary hover:bg-bg-glass-hover'
  }`}>
    <Icon className="w-5 h-5" />
    <span className="font-medium">{label}</span>
  </button>
);

const StatCard = ({ icon: Icon, title, value, trend, trendUp, delay }) => (
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
      <span className={`text-xs font-medium ${trendUp ? 'text-neon-green' : 'text-orange'}`}>
        {trendUp ? '+' : '-'}{trend}
      </span>
    </div>
  </motion.div>
);

const Dashboard = () => {
  return (
    <div className="container mx-auto px-6 lg:px-12 py-8 flex flex-col md:flex-row gap-8">
      {/* Sidebar */}
      <aside className="w-full md:w-64 flex-shrink-0 flex flex-col gap-2 glass-panel p-4 rounded-2xl h-fit sticky top-24">
        <SidebarItem icon={LayoutDashboard} label="Overview" active />
        <SidebarItem icon={FileText} label="All Reports" />
        <SidebarItem icon={Search} label="Lost Items" />
        <SidebarItem icon={MapPin} label="Found Items" />
        <SidebarItem icon={Brain} label="AI Matches" />
        <div className="h-px bg-border-subtle my-2" />
        <SidebarItem icon={User} label="My Reports" />
        <SidebarItem icon={MessageSquare} label="Messages" />
        <SidebarItem icon={Activity} label="Analytics" />
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col gap-8">
        <h1 className="text-2xl font-heading font-bold text-text-primary">Dashboard Overview</h1>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={FileText} title="Total Reports" value="256" trend="12 today" trendUp delay={0.1} />
          <StatCard icon={Search} title="Lost Items" value="128" trend="8 today" trendUp delay={0.2} />
          <StatCard icon={MapPin} title="Found Items" value="128" trend="4 today" trendUp delay={0.3} />
          <StatCard icon={CheckCircle2} title="Successful Matches" value="142" trend="10 this week" trendUp delay={0.4} />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Recent Reports */}
          <div className="xl:col-span-2 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-text-primary">Recent Reports</h2>
              <button className="text-sm font-medium text-text-secondary hover:text-neon-green transition-colors">View All</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { type: 'Lost', item: 'Black College Bag', loc: 'North Block, 2nd Floor', time: '2h ago', img: '🎒' },
                { type: 'Found', item: 'iPhone 13 - Blue', loc: 'Near Canteen', time: '3h ago', img: '📱' },
                { type: 'Found', item: 'Car Key with Keychain', loc: 'Parking Area', time: '5h ago', img: '🔑' },
                { type: 'Lost', item: 'Titan Analog Watch', loc: 'Library Reading Hall', time: '6h ago', img: '⌚' }
              ].map((report, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 * i }}
                  className="glass-card p-4 flex gap-4 cursor-pointer"
                >
                  <div className="w-20 h-20 bg-bg-dark rounded-xl flex items-center justify-center text-4xl border border-border-subtle shadow-inner">
                    {report.img}
                  </div>
                  <div className="flex flex-col justify-between py-1">
                    <div>
                      <span className={`text-[10px] font-bold tracking-wider uppercase ${report.type === 'Lost' ? 'text-orange' : 'text-neon-green'}`}>
                        {report.type}
                      </span>
                      <h4 className="text-sm font-bold text-text-primary truncate w-32">{report.item}</h4>
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1 text-[10px] text-text-muted">
                        <MapPin className="w-3 h-3" /> {report.loc}
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-text-muted">
                        <Clock className="w-3 h-3" /> {report.time}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* AI Matches & Status */}
          <div className="flex flex-col gap-6">
            <h2 className="text-lg font-bold text-text-primary">Top Matched Items</h2>
            
            <div className="glass-card p-4 flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-bg-dark rounded-lg flex items-center justify-center text-xl border border-border-subtle">🎒</div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-text-primary">Black College Bag</h4>
                  <p className="text-xs text-text-muted">Similar bag found near North Block</p>
                </div>
                <span className="text-xs font-bold text-neon-green bg-neon-green/10 px-2 py-1 rounded-md">93% Match</span>
              </div>
            </div>

            <div className="glass-card p-4 flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-bg-dark rounded-lg flex items-center justify-center text-xl border border-border-subtle">📱</div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-text-primary">iPhone 13 - Blue</h4>
                  <p className="text-xs text-text-muted">Found near Canteen area</p>
                </div>
                <span className="text-xs font-bold text-neon-green bg-neon-green/10 px-2 py-1 rounded-md">89% Match</span>
              </div>
            </div>

            <h2 className="text-lg font-bold text-text-primary mt-2">AI Matcher Status</h2>
            <div className="glass-panel p-5 rounded-2xl relative overflow-hidden flex items-center justify-between border-neon-green/20">
              <div className="flex flex-col gap-4 relative z-10">
                <div>
                  <p className="text-[10px] text-text-muted uppercase tracking-wider font-bold">Model Status</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
                    <span className="text-xs font-medium text-text-primary">Active</span>
                  </div>
                </div>
                <div>
                  <p className="text-[10px] text-text-muted uppercase tracking-wider font-bold">Match Engine</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-2 h-2 rounded-full bg-cyan animate-pulse" />
                    <span className="text-xs font-medium text-text-primary">Running</span>
                  </div>
                </div>
                <div>
                  <p className="text-[10px] text-text-muted uppercase tracking-wider font-bold">Last Updated</p>
                  <span className="text-xs font-medium text-text-primary block mt-1">2 mins ago</span>
                </div>
              </div>
              <div className="relative z-10 p-4 rounded-full bg-neon-green/5 border border-neon-green/20 shadow-[0_0_20px_rgba(57,255,136,0.1)]">
                <Brain className="w-10 h-10 text-neon-green drop-shadow-[0_0_8px_rgba(57,255,136,0.5)]" />
              </div>
              <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-neon-green/10 to-transparent pointer-events-none" />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
