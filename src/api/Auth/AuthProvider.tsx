import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { supabase } from "../supabaseClient";
import { setUser, clearUser } from "../../store/authSlice";
import type { User, AuthChangeEvent, Session } from "@supabase/supabase-js";

export default function AuthProvider() {
  const dispatch = useDispatch();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      const user: User | null = data.user;

      if (user) dispatch(setUser(user));
      else dispatch(clearUser());
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (event: AuthChangeEvent, session: Session | null) => {
        console.log("Auth event:", event, session?.user?.email);

        if (session?.user) dispatch(setUser(session.user));
        else dispatch(clearUser());
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [dispatch]);

  return null;
}
