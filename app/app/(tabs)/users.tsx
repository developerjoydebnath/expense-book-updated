import { useUserRole } from '@/hooks/useUserRole';
import { supabase } from '@/services/supabase';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { Alert, FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Appbar, Button, Card, useTheme } from 'react-native-paper';

type User = {
  id: string;
  email: string;
  role: 'USER' | 'ADMIN';
  createdAt: string;
};

export default function AdminUsersScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { isAdmin, loading: roleLoading } = useUserRole();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (!roleLoading && !isAdmin) {
      // If not admin, redirect to Dashboard
      router.replace('/(tabs)');
      Alert.alert('Access Denied', 'You do not have permission to view this page.');
    } else if (isAdmin) {
      fetchUsers();
    }
  }, [isAdmin, roleLoading]);

  async function fetchUsers() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('User')
        .select('*')
        .order('createdAt', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      Alert.alert('Error', 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  }

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchUsers();
    setRefreshing(false);
  }, []);

  async function handleDelete(userId: string) {
    Alert.alert(
      'Delete User',
      'Are you sure you want to delete this user? All their data will be removed permanently.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
             try {
               const { error } = await supabase.from('User').delete().eq('id', userId);
               if (error) throw error;
               setUsers(prev => prev.filter(u => u.id !== userId));
               Alert.alert('Success', 'User deleted successfully');
             } catch (error) {
               console.error('Error deleting user:', error);
               Alert.alert('Error', 'Failed to delete user');
             }
          }
        }
      ]
    );
  }

  if (roleLoading || (loading && users.length === 0)) {
    return (
      <View style={[styles.center, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <Card.Title
              title={item.email}
              subtitle={`Role: ${item.role} | Joined: ${new Date(item.createdAt).toLocaleDateString()}`}
              left={(props) => <Appbar.Action icon="account" {...props} />}
            />
            {item.role !== 'ADMIN' && (
              <Card.Actions>
                <Button 
                  textColor={theme.colors.error} 
                  onPress={() => handleDelete(item.id)}
                >
                  Delete User
                </Button>
              </Card.Actions>
            )}
          </Card>
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    padding: 16,
  },
  card: {
    marginBottom: 12,
  },
});
