// hooks/useAuth.ts
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import  { setUser, clearUser } from '../store/authSlice';
import { supabase } from '../api/supabaseClient';
import { redirect, useNavigate } from 'react-router-dom';

export const useAuth = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.auth.user);
  const authorized = useSelector((state: any) => state.auth.authorized);

  useEffect(() => {
    checkUser();
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
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
    const {data: {session}} = await supabase.auth.getSession()
    if(session?.user){
        dispatch(setUser(session.user))
    }
  }

  // Simple login function
  const login = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (data.user) {
      dispatch(setUser(data.user));
    }
    
    return { data, error };
  };

  // Simple signup function
  const signup = async (email: string, password: string, metadata?: any) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata
      }
    });
    
    if (data.user) {
      dispatch(setUser(data.user));
    }
    
    
    return { data, error };
  };

  // Simple logout function
  const logout = async () => {
    await supabase.auth.signOut();
    dispatch(clearUser());
  };

  return {
    user,
    authorized,
    login,
    signup,
    logout
  };
};