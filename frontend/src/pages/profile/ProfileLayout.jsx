import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { User, FileText, MessageSquare, Activity, LogOut } from 'lucide-react';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

const SidebarItem = ({ icon: Icon, label, path, exact }) => {
  const location = useLocation();
  const active = exact ? location.pathname === path : location.pathname.startsWith(path);

  return (
    <NavLink 
      to={path}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
        active 
          ? 'bg-neon-green/10 text-neon-green border border-neon-green/20' 
          : 'text-text-secondary hover:text-text-primary hover:bg-bg-glass-hover'
      }`}
    >
      <Icon className="w-5 h-5" />
      <span className="font-medium">{label}</span>
    </NavLink>
  );
};

const ProfileLayout = () => {
  const { logout } = useContext(AuthContext);

  return (
    <div className="container mx-auto px-6 lg:px-12 py-8 flex flex-col md:flex-row gap-8 min-h-[calc(100vh-8rem)]">
      {/* Sidebar */}
      <aside className="w-full md:w-64 flex-shrink-0 flex flex-col gap-2 glass-panel p-4 rounded-2xl h-fit sticky top-24">
        <div className="px-2 pb-4 mb-2 border-b border-border-subtle">
          <h2 className="text-xl font-heading font-bold text-text-primary">Profile</h2>
        </div>
        <SidebarItem icon={User} label="Overview" path="/profile" exact />
        <SidebarItem icon={FileText} label="My Reports" path="/profile/reports" />
        <SidebarItem icon={MessageSquare} label="Messages" path="/profile/messages" />
        <SidebarItem icon={Activity} label="Analytics" path="/profile/analytics" />
        
        <div className="h-px bg-border-subtle my-2" />
        
        <button 
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-orange hover:bg-orange/10"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col gap-8">
        <Outlet />
      </div>
    </div>
  );
};

export default ProfileLayout;
