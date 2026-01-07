
import { useThemeContext } from '@/context/ThemeContext';
import { useUserRole } from '@/hooks/useUserRole';
import { Tabs } from 'expo-router';
import { CreditCard, LayoutDashboard, LogOut, Moon, Sun, Users, Wallet } from 'lucide-react-native';
import React from 'react';
import { View } from 'react-native';
import { IconButton, useTheme } from 'react-native-paper';
import { supabase } from '../../services/supabase';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabLayout() {
  const theme = useTheme();
  const { isAdmin } = useUserRole();
  const { toggleTheme, isDark } = useThemeContext();
  const insets = useSafeAreaInsets();

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        headerShown: true,
        headerRight: () => (
          <View style={{ flexDirection: 'row' }}>
            <IconButton
              icon={() => isDark ? <Sun size={20} color={theme.colors.onSurface} /> : <Moon size={20} color={theme.colors.onSurface} />}
              onPress={toggleTheme}
            />
            <IconButton
              icon={() => <LogOut size={20} color={theme.colors.error} />}
              onPress={handleLogout}
            />
          </View>
        ),
        tabBarStyle: {
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom + 8,
          paddingTop: 8,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color }) => <LayoutDashboard size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="expenses"
        options={{
          title: 'Expenses',
          tabBarIcon: ({ color }) => <CreditCard size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="incomes"
        options={{
          title: 'Incomes',
          tabBarIcon: ({ color }) => <Wallet size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="users"
        options={{
          title: 'Users',
          tabBarIcon: ({ color }) => <Users size={24} color={color} />,
          href: isAdmin ? undefined : null,
        }}
      />
    </Tabs>
  );
}

