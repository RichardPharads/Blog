// hooks/useAuth.ts
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUser, clearUser } from '../store/authSlice';
import { supabase } from '../api/supabaseClient';
import { useNavigate } from 'react-router-dom';
import type { RootState } from '../store/store'; // Import your RootState type

export const useAuth = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Use proper typing with RootState
  const user = useSelector((state: RootState) => state.auth.user);
  const authorized = useSelector((state: RootState) => state.auth.authorized);
  const loading = useSelector((state: RootState) => state.auth.loading);

  useEffect(() => {
    checkUser();
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_:string, session) => {
        if (session?.user) {
          dispatch(setUser(session.user));
        } else {
          dispatch(clearUser());
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [dispatch]);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      dispatch(setUser(session.user));
    } else {
      dispatch(clearUser());
    }
  };

  // Simple login function
  const login = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (data.user) {
      dispatch(setUser(data.user));
      navigate('/'); // Redirect after login
    }
    
    return { data, error };
  };

  // Simple signup function
  const signup = async (email: string, password: string, metadata?: Record<string ,any>) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata
      }
    });
    
    if (data.user) {
      dispatch(setUser(data.user));
      navigate('/');
    }
    
    return { data, error };
  };

  // Simple logout function
  const logout = async () => {
    await supabase.auth.signOut();
    dispatch(clearUser());
    navigate('/login'); // Redirect to login after logout
  };

  return {
    user,
    authorized,
    loading,
    login,
    signup,
    logout
  };
};