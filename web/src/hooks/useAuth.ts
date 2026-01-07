import { forgotPassword as libForgotPassword, login as libLogin, logout as libLogout, registerUser as libRegister } from "@/lib/auth";
import { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { useQuery } from "urql";
import { GET_PROFILE } from "../lib/queries";
import { supabase } from "../lib/supabase";
import { User as DBUser } from "../lib/types";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [loading]);

  return { user, loading };
}

export function useProfile() {
  const { user, loading: authLoading } = useAuth();
  
  const [{ data, fetching, error }] = useQuery({
    query: GET_PROFILE,
    variables: { email: user?.email || "" },
    pause: !user?.email,
  });

  const profile = data?.userCollection?.edges[0]?.node as DBUser | undefined;

  return {
    profile,
    isAdmin: profile?.role === "ADMIN",
    isLoading: authLoading || fetching,
    error
  };
}

export const login = libLogin;
export const register = libRegister;
export const forgotPassword = libForgotPassword;
export const logout = libLogout;
