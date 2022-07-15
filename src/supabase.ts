import { createClient, SupabaseClientOptions } from "@supabase/supabase-js";
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "./config";

const options = <SupabaseClientOptions>{
    persistSession: true,
    autoRefreshToken: true,
};

// Create a single supabase client for interacting with your database
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, options);

export default supabase;
