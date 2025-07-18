import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://fzoxoaerapxioebvwkhm.supabase.co';
const supabaseAnonKey =  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ6b3hvYWVyYXB4aW9lYnZ3a2htIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3NjAzMzAsImV4cCI6MjA2ODMzNjMzMH0.YB3koRdywsXqS649kxooGZB2MUWRmf8fdcbRhX-YGKo';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
