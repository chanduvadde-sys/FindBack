import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

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

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center py-12 px-4 font-sans text-zinc-900">
      <div className="max-w-md w-full bg-white p-8 border border-zinc-200 rounded-lg shadow-sm">
        <div className="text-center mb-8">
          <Link to="/" className="text-xl font-semibold tracking-tight text-zinc-900 mb-2 inline-block">FindBack.</Link>
          <h2 className="text-2xl font-semibold">Welcome back</h2>
          <p className="text-zinc-500 text-sm mt-1">Enter your credentials to access your account.</p>
        </div>
        
        {error && <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded border border-red-100">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">Email</label>
            <input type="email" required className="w-full p-2.5 border border-zinc-300 rounded-md focus:ring-1 focus:ring-zinc-900 outline-none" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">Password</label>
            <input type="password" required className="w-full p-2.5 border border-zinc-300 rounded-md focus:ring-1 focus:ring-zinc-900 outline-none" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} />
          </div>
          <button type="submit" disabled={loading} className="w-full py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white font-medium rounded-md transition-colors disabled:opacity-50">
            {loading ? 'Logging in...' : 'Log in'}
          </button>
        </form>
        
        <p className="mt-6 text-center text-sm text-zinc-500">
          Don't have an account? <Link to="/register" className="text-zinc-900 font-medium hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
