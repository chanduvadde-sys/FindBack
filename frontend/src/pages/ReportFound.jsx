import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function ReportFound() {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    category: '',
    color: '',
    locationText: '',
    dateTime: '',
    description: '',
    image: null
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({ ...prev, image: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/found-items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();

      if (data.success) {
        setSubmitted(true);
        setFormData({ category: '', color: '', locationText: '', dateTime: '', description: '', image: null });
      } else {
        alert('Database error: ' + data.error + '\n\nMake sure PostgreSQL is installed and running!');
      }
    } catch (error) {
      console.error('Network Error:', error);
      alert('Could not connect to backend server. Make sure node index.js is running!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg">
        {submitted ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-3">Item Reported!</h2>
            <p className="text-gray-500 mb-8">Thank you for reporting this found item. We are matching it with lost reports.</p>
            <Link to="/my-matches" className="block w-full bg-zinc-900 hover:bg-zinc-800 text-white font-semibold py-3 rounded-lg shadow transition-colors text-center">
              View My Matches
            </Link>
            <button onClick={() => setSubmitted(false)} className="mt-6 text-sm text-zinc-500 hover:text-zinc-900 underline">Submit another report</button>
          </div>
        ) : (
          <>
            <button onClick={() => navigate(-1)} className="text-blue-500 hover:underline mb-4">&larr; Back</button>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Report Found Item</h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select name="category" value={formData.category} onChange={handleChange} required className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none">
                  <option value="">Select Category</option>
                  <option value="electronics">Electronics (Phones, Laptops)</option>
                  <option value="wallet">Wallet / ID / Keys</option>
                  <option value="clothing">Clothing / Bags</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                <input type="text" name="color" value={formData.color} onChange={handleChange} placeholder="e.g. Black, Red" className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location Found</label>
                <input type="text" name="locationText" value={formData.locationText} onChange={handleChange} required placeholder="e.g. Cafeteria, Table 4" className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date & Time Found</label>
                <input type="datetime-local" name="dateTime" value={formData.dateTime} onChange={handleChange} required className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description (Don't reveal everything)</label>
                <textarea name="description" value={formData.description} onChange={handleChange} rows="3" placeholder="Describe the item, but leave out a hidden detail for verification." className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Upload Photo (Optional)</label>
                <input type="file" accept="image/*" onChange={handleFileChange} className="w-full p-2 border rounded-md text-sm" />
              </div>

              <button type="submit" className="mt-4 w-full border border-zinc-300 hover:bg-zinc-50 text-zinc-900 font-bold py-3 rounded-lg shadow-sm transition-colors">
                Submit Found Report
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default ReportFound;
