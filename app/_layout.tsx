import { ToastProvider } from '@/components/shared/ToastProvider';
import { ThemeProvider as AppThemeProvider, useThemeContext } from '@/context/ThemeContext';
import { DarkTheme, DefaultTheme, ThemeProvider as NavThemeProvider } from '@react-navigation/native';
import { Session } from '@supabase/supabase-js';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { MD3DarkTheme, MD3LightTheme, PaperProvider } from 'react-native-paper';
import { enGB, registerTranslation } from 'react-native-paper-dates';
import { Provider } from 'urql';
import { graphqlClient } from '../services/graphqlClient';
import { supabase } from '../services/supabase';

registerTranslation('en-GB', enGB);

export const unstable_settings = {
  anchor: '(tabs)',
};

function InnerRootLayout() {
  const { isDark } = useThemeContext();
  const [session, setSession] = useState<Session | null>(null);
  const [initialized, setInitialized] = useState(false);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setInitialized(true);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  useEffect(() => {
    if (!initialized) return;

    const inAuthGroup = segments[0] === 'auth';

    if (!session && !inAuthGroup) {
      router.replace('/auth/login');
    } else if (session && inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [session, segments, initialized, router]);

  const paperTheme = isDark ? MD3DarkTheme : MD3LightTheme;

  return (
    <Provider value={graphqlClient}>
      <PaperProvider theme={paperTheme}>
        <NavThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
          <ToastProvider>
            <Stack>
              <Stack.Screen name="auth/login" options={{ headerShown: false }} />
              <Stack.Screen name="auth/register" options={{ headerShown: false }} />
              <Stack.Screen name="auth/forgot-password" options={{ title: 'Reset Password' }} />
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Add Money' }} />
            </Stack>
          </ToastProvider>
          <StatusBar style={isDark ? "light" : "dark"} />
        </NavThemeProvider>
      </PaperProvider>
    </Provider>
  );
}

export default function RootLayout() {
  return (
    <AppThemeProvider>
      <InnerRootLayout />
    </AppThemeProvider>
  );
}
