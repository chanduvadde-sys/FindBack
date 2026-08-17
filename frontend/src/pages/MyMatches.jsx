import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function MyMatches() {
  const { token } = useContext(AuthContext);
  const [lostItems, setLostItems] = useState([]);
  const [matchesMap, setMatchesMap] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) fetchLostItems();
  }, [token]);

  const fetchLostItems = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/my-lost-items`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setLostItems(data.items);
        data.items.forEach(item => fetchMatches(item.id));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMatches = async (lostItemId) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/matches/${lostItemId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setMatchesMap(prev => ({ ...prev, [lostItemId]: data.matches }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <div className="p-10 text-center text-zinc-500">Loading your reports...</div>;
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans text-zinc-900 p-6 md:p-12">
      <div className="max-w-5xl mx-auto">
        
        <div className="flex justify-between items-end mb-10">
          <div>
            <Link to="/" className="text-zinc-400 hover:text-zinc-900 text-sm mb-4 inline-block">&larr; Back to Home</Link>
            <h1 className="text-3xl font-semibold tracking-tight">My Matches</h1>
            <p className="text-zinc-500 mt-2">View potential found items for your lost reports.</p>
          </div>
          <Link to="/report-lost" className="px-4 py-2 bg-zinc-900 text-white rounded-md text-sm hover:bg-zinc-800">
            Report Another
          </Link>
        </div>

        {lostItems.length === 0 ? (
          <div className="bg-white border border-zinc-200 rounded-lg p-10 text-center">
            <p className="text-zinc-500 mb-4">You haven't reported any lost items yet.</p>
            <Link to="/report-lost" className="text-zinc-900 font-medium underline">Report a lost item</Link>
          </div>
        ) : (
          <div className="space-y-8">
            {lostItems.map(item => {
              const matches = matchesMap[item.id] || [];
              
              return (
                <div key={item.id} className="bg-white border border-zinc-200 rounded-lg overflow-hidden shadow-sm">
                  {/* Lost Item Header */}
                  <div className="bg-zinc-50 border-b border-zinc-200 p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="inline-block px-2 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded mb-3 uppercase tracking-wider">Lost Item</span>
                        <h2 className="text-xl font-semibold capitalize">{item.category} - {item.color}</h2>
                        <p className="text-zinc-500 text-sm mt-1">Lost at {item.location_text} • {new Date(item.lost_at).toLocaleDateString()}</p>
                      </div>
                      <span className="text-sm font-medium text-zinc-500">{matches.length} matches found</span>
                    </div>
                  </div>

                  {/* Matches List */}
                  <div className="p-6">
                    {matches.length === 0 ? (
                      <p className="text-zinc-400 text-sm italic">No potential matches found yet. We'll keep looking!</p>
                    ) : (
                      <div className="space-y-4">
                        {matches.map(match => (
                          <div key={match.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border border-zinc-100 bg-zinc-50/50 rounded-lg">
                            <div className="mb-4 sm:mb-0">
                              <div className="flex items-center gap-3 mb-1">
                                <h3 className="font-semibold text-zinc-900 capitalize">{match.category} - {match.color}</h3>
                                <span className={`px-2 py-0.5 rounded text-xs font-bold ${match.total_score >= 80 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                  {match.total_score}% Match
                                </span>
                              </div>
                              <p className="text-sm text-zinc-500">Found at {match.location_text} on {new Date(match.found_at).toLocaleDateString()}</p>
                              
                              {/* Score Breakdown */}
                              <div className="flex gap-4 mt-3 text-xs text-zinc-400">
                                <span>Category: {match.category_score}/30</span>
                                <span>Location: {match.location_score}/25</span>
                                <span>Time: {match.time_score}/20</span>
                                <span>Description: {match.text_score}/25</span>
                              </div>
                            </div>
                            
                            <button className="px-4 py-2 border border-zinc-300 bg-white text-zinc-900 rounded text-sm hover:bg-zinc-50 font-medium">
                              Claim Item
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyMatches;


