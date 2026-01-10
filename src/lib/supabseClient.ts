// src/lib/supabaseClient.ts
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  // Warn in dev so you notice missing env vars
  // (This file is safe to import even if envs are missing)
  // Set these in .env.local or Vercel project settings
  // VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
  // eslint-disable-next-line no-console
  console.warn("Missing Supabase env vars: VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY");
}

export const supabase = createClient(SUPABASE_URL ?? "", SUPABASE_ANON_KEY ?? "");