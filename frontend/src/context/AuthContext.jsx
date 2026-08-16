import React, { createContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email, password) => {
    return supabase.auth.signInWithPassword({ email, password });
  };

  const register = async (email, password, name) => {
    return supabase.auth.signUp({ 
      email, 
      password,
      options: {
        data: { name }
      }
    });
  };

  const logout = async () => {
    return supabase.auth.signOut();
  };

  // Provide a token alias for existing code
  const token = session?.access_token;

  return (
    <AuthContext.Provider value={{ user, token, session, login, register, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
