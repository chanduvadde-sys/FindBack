import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function Home() {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col font-sans text-zinc-900">
      {/* Navbar */}
      <nav className="w-full max-w-6xl mx-auto py-6 px-6 sm:px-8 flex justify-between items-center z-10">
        <div className="flex items-center gap-2">
          <span className="text-xl font-semibold tracking-tight text-zinc-900">FindBack.</span>
        </div>
        <div className="hidden sm:flex items-center gap-6 text-sm text-zinc-500">
          <a href="#how-it-works" className="hover:text-zinc-900 transition-colors">How It Works</a>
          <Link to="/my-matches" className="hover:text-zinc-900 transition-colors font-medium">My Matches</Link>
          {user ? (
            <button onClick={logout} className="hover:text-zinc-900 transition-colors">Log out</button>
          ) : (
            <Link to="/login" className="hover:text-zinc-900 transition-colors">Log in</Link>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-grow flex flex-col items-center justify-center px-6 py-12 sm:py-20 text-center">
        <div className="max-w-3xl mx-auto flex flex-col items-center">
          
          <h1 className="text-4xl sm:text-5xl font-semibold text-zinc-900 tracking-tight mb-4 leading-tight">
            Lost. Found. Reunited.
          </h1>
          
          <p className="text-base sm:text-lg text-zinc-500 font-normal mb-8 max-w-xl">
            The automated matching engine that connects lost reports with found items securely and instantly.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Link 
              to="/report-lost" 
              className="px-5 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white text-sm font-medium rounded-md shadow-sm transition-colors w-full sm:w-auto"
            >
              I Lost Something
            </Link>
            
            <Link 
              to="/report-found" 
              className="px-5 py-2.5 bg-white border border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50 text-zinc-900 text-sm font-medium rounded-md shadow-sm transition-colors w-full sm:w-auto"
            >
              I Found Something
            </Link>
          </div>
        </div>
      </main>

      {/* How It Works Section */}
      <section id="how-it-works" className="w-full py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl font-semibold text-center text-zinc-900 mb-10 tracking-tight">How it works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            {/* Step 1 */}
            <div className="flex flex-col border-t border-zinc-200 pt-6">
              <span className="text-xs font-semibold text-zinc-400 mb-2 tracking-widest uppercase">Step 1</span>
              <h3 className="text-base font-medium text-zinc-900 mb-2">Report</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">File a quick report with details about what you lost or found. No account required to start.</p>
            </div>
            
            {/* Step 2 */}
            <div className="flex flex-col border-t border-zinc-200 pt-6">
              <span className="text-xs font-semibold text-zinc-400 mb-2 tracking-widest uppercase">Step 2</span>
              <h3 className="text-base font-medium text-zinc-900 mb-2">Match</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">Our automated engine scans for matches based on category, location, and time parameters.</p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col border-t border-zinc-200 pt-6">
              <span className="text-xs font-semibold text-zinc-400 mb-2 tracking-widest uppercase">Step 3</span>
              <h3 className="text-base font-medium text-zinc-900 mb-2">Recover</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">Verify ownership with a hidden question to ensure the item goes back to the rightful owner safely.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
