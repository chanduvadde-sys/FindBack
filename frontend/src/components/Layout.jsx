import React from 'react';
import Navbar from './Navbar';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-bg-dark text-text-primary overflow-x-hidden">
      <Navbar />
      <main className="pt-24 pb-12">
        {children}
      </main>
    </div>
  );
};

export default Layout;
