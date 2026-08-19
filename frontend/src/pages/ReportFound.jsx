import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ArrowLeft, CheckCircle2, UploadCloud, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

function ReportFound() {
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
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
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/found-items`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
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

  const inputClass = "w-full bg-bg-dark border border-border-subtle rounded-lg py-3 px-4 text-sm text-text-primary focus:outline-none focus:border-cyan/50 transition-colors placeholder:text-text-muted";
  const labelClass = "block text-sm font-medium text-text-secondary mb-2";

  return (
    <div className="container mx-auto px-6 lg:px-12 py-12 flex flex-col items-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl glass-card p-8 md:p-12 relative overflow-hidden"
      >
        {/* Glow decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan/10 rounded-full blur-[100px] pointer-events-none" />

        {submitted ? (
          <div className="text-center py-12 flex flex-col items-center relative z-10">
            <div className="w-20 h-20 bg-cyan/10 border border-cyan/30 text-cyan rounded-2xl flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(0,217,255,0.2)]">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-3xl font-heading font-bold text-text-primary mb-3">Item Reported!</h2>
            <p className="text-text-secondary mb-8 max-w-sm">Thank you for reporting this found item. We are matching it with lost reports.</p>
            <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
              <button onClick={() => setSubmitted(false)} className="btn-glass w-full sm:w-auto">
                Submit Another
              </button>
            </div>
          </div>
        ) : (
          <div className="relative z-10">
            <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors mb-8">
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 rounded-xl bg-cyan/10 text-cyan border border-cyan/20">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-3xl font-heading font-bold text-text-primary">Report Found Item</h2>
                <p className="text-sm text-text-muted mt-1">Help return this item to its rightful owner.</p>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={labelClass}>Category *</label>
                  <select name="category" value={formData.category} onChange={handleChange} required className={`${inputClass} appearance-none`}>
                    <option value="" className="bg-bg-dark">Select Category</option>
                    <option value="electronics" className="bg-bg-dark">Electronics (Phones, Laptops)</option>
                    <option value="wallet" className="bg-bg-dark">Wallet / ID / Keys</option>
                    <option value="clothing" className="bg-bg-dark">Clothing / Bags</option>
                    <option value="other" className="bg-bg-dark">Other</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Color</label>
                  <input type="text" name="color" value={formData.color} onChange={handleChange} placeholder="e.g. Black, Red" className={inputClass} />
                </div>
              </div>

              <div>
                <label className={labelClass}>Location Found *</label>
                <input type="text" name="locationText" value={formData.locationText} onChange={handleChange} required placeholder="e.g. Cafeteria, Table 4" className={inputClass} />
              </div>

              <div>
                <label className={labelClass}>Date & Time Found *</label>
                <input type="datetime-local" name="dateTime" value={formData.dateTime} onChange={handleChange} required className={`${inputClass} [color-scheme:dark]`} />
              </div>

              <div>
                <label className={labelClass}>Description (Don't reveal everything)</label>
                <textarea name="description" value={formData.description} onChange={handleChange} rows="4" placeholder="Describe the item, but leave out a hidden detail for verification." className={inputClass}></textarea>
              </div>

              <div>
                <label className={labelClass}>Upload Photo (Optional)</label>
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border-subtle rounded-xl cursor-pointer bg-bg-dark hover:bg-bg-glass-hover hover:border-cyan/30 transition-all">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <UploadCloud className="w-8 h-8 text-text-muted mb-2" />
                    <p className="text-sm text-text-secondary font-medium">Click to upload or drag and drop</p>
                    <p className="text-xs text-text-muted mt-1">SVG, PNG, JPG or GIF</p>
                  </div>
                  <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                </label>
              </div>

              <div className="pt-4 border-t border-border-subtle">
                <button type="submit" className="btn-secondary w-full text-lg py-4">
                  Submit Found Report
                </button>
              </div>
            </form>
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default ReportFound;


