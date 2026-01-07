import { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';

export function useUserRole() {
  const [role, setRole] = useState<'USER' | 'ADMIN' | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkRole();
  }, []);

  async function checkRole() {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('User') // Note: Prisma model 'User' maps to table 'User' (case sensitive usually "User" or public."User")
        .select('role')
        .eq('id', session.user.id) // Assuming id is the same
        .single();

      if (error) {
        console.error('Error fetching role:', error);
      }

      if (data) {
        setRole(data.role);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  return { role, loading, isAdmin: role === 'ADMIN' };
}
