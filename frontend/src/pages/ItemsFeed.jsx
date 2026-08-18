import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, MapPin, Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const ItemCard = ({ type, name, location, time, matchScore, icon, delay, index }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay }}
    className="glass-card group flex flex-col overflow-hidden"
  >
    <div className="h-40 bg-bg-dark border-b border-border-subtle flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-bg-glass to-transparent" />
      <span className="text-6xl group-hover:scale-110 transition-transform duration-500 drop-shadow-2xl z-10">{icon}</span>
      
      {/* Status Badge */}
      <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest backdrop-blur-md border ${
        type === 'Lost' 
          ? 'bg-orange/20 text-orange border-orange/30' 
          : 'bg-neon-green/20 text-neon-green border-neon-green/30'
      }`}>
        {type}
      </div>
    </div>
    
    <div className="p-5 flex flex-col gap-3">
      <div className="flex justify-between items-start">
        <h3 className="font-bold text-text-primary text-lg truncate pr-2">{name}</h3>
        {matchScore && (
          <div className="bg-neon-green/10 text-neon-green border border-neon-green/30 px-2 py-0.5 rounded-md text-xs font-bold whitespace-nowrap">
            {matchScore}% Match
          </div>
        )}
      </div>
      
      <div className="flex flex-col gap-1.5 mt-1">
        <div className="flex items-center gap-2 text-sm text-text-secondary">
          <MapPin className="w-4 h-4 text-text-muted" /> {location}
        </div>
        <div className="flex items-center gap-2 text-sm text-text-secondary">
          <Clock className="w-4 h-4 text-text-muted" /> {time}
        </div>
      </div>
      
      <Link to={`/matches/${index}`} className="mt-4 pt-4 border-t border-border-subtle flex items-center justify-between text-sm font-medium text-text-muted group-hover:text-neon-green transition-colors">
        <span>View Details</span>
        <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  </motion.div>
);

const ItemsFeed = () => {
  const [filterType, setFilterType] = useState('All');

  const items = [
    { type: 'Lost', name: 'Black College Bag', loc: 'North Block', time: '2 hours ago', score: 93, icon: '🎒' },
    { type: 'Found', name: 'iPhone 13 - Blue', loc: 'Canteen', time: '3 hours ago', score: 89, icon: '📱' },
    { type: 'Found', name: 'Car Key with Keychain', loc: 'Parking Area', time: '5 hours ago', score: null, icon: '🔑' },
    { type: 'Lost', name: 'Titan Analog Watch', loc: 'Library', time: '6 hours ago', score: null, icon: '⌚' },
    { type: 'Lost', name: 'Black Wallet', loc: 'Hostel Block', time: '1 day ago', score: 75, icon: '💳' },
    { type: 'Found', name: 'Water Bottle', loc: 'Auditorium', time: '1 day ago', score: null, icon: '🚰' },
    { type: 'Found', name: 'Wireless Headphones', loc: 'Library', time: '2 days ago', score: 95, icon: '🎧' },
    { type: 'Lost', name: 'Student ID Card', loc: 'Canteen', time: '2 days ago', score: null, icon: '🪪' },
  ];

  const filteredItems = filterType === 'All' ? items : items.filter(item => item.type === filterType);

  return (
    <div className="container mx-auto px-6 lg:px-12 py-8 flex flex-col gap-8">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-text-primary">Campus Items Feed</h1>
          <p className="text-text-secondary mt-1">Browse and search all reported lost and found items across campus.</p>
        </div>
        <div className="flex items-center gap-2">
          {['All', 'Lost', 'Found'].map(f => (
            <button 
              key={f}
              onClick={() => setFilterType(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filterType === f 
                  ? 'bg-text-primary text-bg-dark shadow-md' 
                  : 'glass-panel text-text-secondary hover:text-text-primary hover:bg-bg-glass-hover'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Filters Bar */}
      <div className="glass-panel p-4 rounded-xl flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
          <input 
            type="text" 
            placeholder="Search items by name, category, or description..." 
            className="w-full bg-bg-dark border border-border-subtle rounded-lg py-3 pl-12 pr-4 text-sm text-text-primary focus:outline-none focus:border-neon-green/50 transition-colors placeholder:text-text-muted"
          />
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <button className="flex-1 md:flex-none glass-panel px-4 py-3 rounded-lg text-sm text-text-secondary flex items-center justify-center gap-2 hover:bg-bg-glass-hover transition-colors">
            <Filter className="w-4 h-4" /> Category
          </button>
          <button className="flex-1 md:flex-none glass-panel px-4 py-3 rounded-lg text-sm text-text-secondary flex items-center justify-center gap-2 hover:bg-bg-glass-hover transition-colors">
            <MapPin className="w-4 h-4" /> Location
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredItems.map((item, i) => (
          <ItemCard 
            key={i}
            index={i}
            type={item.type}
            name={item.name}
            location={item.loc}
            time={item.time}
            matchScore={item.score}
            icon={item.icon}
            delay={i * 0.05}
          />
        ))}
      </div>

    </div>
  );
};

export default ItemsFeed;
