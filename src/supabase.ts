import { createClient, SupabaseClientOptions } from "@supabase/supabase-js";
import config from "./config";

const options = <SupabaseClientOptions>{
    persistSession: true,
    autoRefreshToken: true,
    // cookieOptions: {
    //     maxAge: 1000 * 60 * 60 * 24 * 7,
    //     sameSite: 'strict',
    //     secure: true,
    //     httpOnly: true
    // },
};

// Create a single supabase client for interacting with your database
export const supabase = createClient(config.API_URL, config.API_KEY, options);

export default supabase;
