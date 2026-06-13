import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://mpegiwdjovzvzqxtgifj.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_BPJm4CyR7EaM5fdYB_6NaQ_9Ei4nt2O';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
