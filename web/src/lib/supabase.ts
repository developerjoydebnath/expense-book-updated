import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://kaebjbashfwknfwkakjk.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImthZWJqYmFzaGZ3a25md2tha2prIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY1Mzg2NTEsImV4cCI6MjA4MjExNDY1MX0.qONC_8ZxS2z3cZ_ze948L6TXwqOrftivaO_-RRx5Uf8';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
