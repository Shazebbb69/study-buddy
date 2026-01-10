// src/utils/auth.ts
// Supabase auth helpers used by UI components.
// Exports a synchronous isLoggedIn() for quick UI checks and async helpers for real state.

import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "../lib/supabseClient";

export const getUser = async (): Promise<User | null> => {
  try {
    const { data } = await supabase.auth.getUser();
    return data?.user ?? null;
  } catch {
    return null;
  }
};

export const getSession = async (): Promise<Session | null> => {
  try {
    const { data } = await supabase.auth.getSession();
    return data?.session ?? null;
  } catch {
    return null;
  }
};

/**
 * Synchronous helper for components that expect a boolean immediately.
 * It uses a quick localStorage heuristic that Supabase uses to persist session.
 * This is only a heuristic for initial UI state; subscribe to onAuthStateChange for accurate updates.
 */
export const isLoggedIn = (): boolean => {
  try {
    // Supabase stores session in localStorage under 'supabase.auth.token' (implementation detail)
    // This is a heuristic and may change with supabase client versions.
    return Boolean(localStorage.getItem("supabase.auth.token") || localStorage.getItem("token"));
  } catch {
    return false;
  }
};

/**
 * Subscribe to auth state changes. Returns an unsubscribe function.
 * Callback receives the current session or null.
 */
export const onAuthStateChange = (cb: (session: Session | null) => void): (() => void) => {
  const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
    try {
      cb(session ?? null);
    } catch {
      // swallow
    }
  });
  return () => {
    listener?.subscription?.unsubscribe();
  };
};

export const login = async (email: string, password: string) => {
  return supabase.auth.signInWithPassword({ email, password });
};

export const logout = async (): Promise<void> => {
  await supabase.auth.signOut();
  try {
    window.dispatchEvent(new CustomEvent("authChanged"));
  } catch {}
};