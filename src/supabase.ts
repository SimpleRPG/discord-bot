import { createClient } from '@supabase/supabase-js'
import config from './config';

// Create a single supabase client for interacting with your database
export const supabase = createClient(config.API_URL, config.API_KEY);

export default supabase;
