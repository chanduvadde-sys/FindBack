import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Brain } from 'lucide-react';
import { motion } from 'framer-motion';

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    const { error } = await login(formData.email, formData.password);
    
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      navigate('/');
    }
  };

  const inputClass = "w-full bg-bg-dark border border-border-subtle rounded-lg py-3 px-4 text-sm text-text-primary focus:outline-none focus:border-neon-green/50 transition-colors placeholder:text-text-muted";
  const labelClass = "block text-sm font-medium text-text-secondary mb-2";

  return (
    <div className="container mx-auto px-6 lg:px-12 py-12 flex flex-col items-center justify-center min-h-[calc(100vh-8rem)]">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md glass-card p-8 md:p-10 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-neon-green/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="text-center mb-8 relative z-10">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-neon-green/20 to-cyan/20 border border-neon-green/30 flex items-center justify-center mx-auto mb-4">
            <Brain className="text-neon-green w-7 h-7" />
          </div>
          <h2 className="text-2xl font-heading font-bold text-text-primary">Welcome Back</h2>
          <p className="text-text-secondary text-sm mt-2">Access your FindBack account</p>
        </div>
        
        {error && <div className="mb-6 p-3 bg-red-500/10 text-red-400 border border-red-500/20 text-sm rounded-lg text-center relative z-10">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          <div>
            <label className={labelClass}>Email Address</label>
            <input type="email" required className={inputClass} value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
          </div>
          <div>
            <label className={labelClass}>Password</label>
            <input type="password" required className={inputClass} value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 mt-2 disabled:opacity-50 flex items-center justify-center gap-2">
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>
        
        <p className="mt-6 text-center text-sm text-text-muted relative z-10">
          Don't have an account? <Link to="/register" className="text-neon-green font-medium hover:underline">Sign up</Link>
        </p>
      </motion.div>
    </div>
  );
}

export default Login;
