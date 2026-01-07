import { cacheExchange, createClient, debugExchange, fetchExchange } from 'urql';
import { supabase } from './supabase';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

export const graphqlClient = createClient({
  // Ensure the client never uses GET for queries to avoid 204 No Content issues
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