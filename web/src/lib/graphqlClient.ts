import { cacheExchange, createClient, debugExchange, fetchExchange } from 'urql';
import { supabase } from './supabase';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://kaebjbashfwknfwkakjk.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImthZWJqYmFzaGZ3a25md2tha2prIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY1Mzg2NTEsImV4cCI6MjA4MjExNDY1MX0.qONC_8ZxS2z3cZ_ze948L6TXwqOrftivaO_-RRx5Uf8';

export const graphqlClient = createClient({
  exchanges: [debugExchange, cacheExchange, fetchExchange],
  url: `${supabaseUrl}/graphql/v1`,
  preferGetMethod: false,
  fetch: async (input, init) => {
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token || supabaseAnonKey;
    
    return fetch(input, {
      ...init,
      headers: {
        ...init?.headers,
        'apikey': supabaseAnonKey,
        'Authorization': `Bearer ${token}`,
      },
    });
  },
});
