"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { createClient } from "@/lib/supabase/client";
import type { AuthChangeEvent, Session, User } from "@supabase/supabase-js";
import type { Profile } from "@/lib/types";

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (
    email: string,
    password: string,
    fullName: string,
    role?: "customer" | "vendor" | "wholesaler"
  ) => Promise<{ error?: string; user?: User | null }>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  signIn: async () => ({}),
  signUp: async () => ({ error: "Auth not configured" }),
  signInWithGoogle: async () => {},
  signOut: async () => {},
  refreshProfile: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  const isReady = supabase && supabase.auth;

  const fetchProfile = useCallback(async (userId: string) => {
    if (!isReady) return null;
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();
    return data as Profile | null;
  }, [supabase, isReady]);

  const refreshProfile = useCallback(async () => {
    if (user && isReady) {
      const p = await fetchProfile(user.id);
      setProfile(p);
    }
  }, [user, fetchProfile, isReady]);

  useEffect(() => {
    if (!isReady) {
      setLoading(false);
      return;
    }

    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        const p = await fetchProfile(user.id);
        setProfile(p);
      }
      setLoading(false);
    };

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event: AuthChangeEvent, session: Session | null) => {
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        if (currentUser) {
          const p = await fetchProfile(currentUser.id);
          setProfile(p);
        } else {
          setProfile(null);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, [supabase, fetchProfile, isReady]);

  const signIn = async (email: string, password: string) => {
    if (!isReady) return { error: "Supabase not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local" };
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: error.message };
    return {};
  };

  const signUp = async (
    email: string,
    password: string,
    fullName: string,
    role: "customer" | "vendor" | "wholesaler" = "customer"
  ) => {
    if (!isReady) return { error: "Supabase not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local" };
    const { error, data } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName, role } },
    });
    if (error) return { error: error.message };
    // Try to create the profile immediately for auto-confirmed users
    if (data?.user) {
      try {
        await supabase.from("profiles").upsert({
          id: data.user.id,
          email: email,
          full_name: fullName,
          role: role,
          status: role === "vendor" || role === "wholesaler" ? "pending" : "approved",
        }, { onConflict: "id" });
      } catch { /* profile may already exist from trigger */ }
    }
    return { user: data?.user ?? null };
  };

  const signInWithGoogle = async () => {
    if (!isReady) return;
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  };

  const signOut = async () => {
    if (isReady) await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        signIn,
        signUp,
        signInWithGoogle,
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
