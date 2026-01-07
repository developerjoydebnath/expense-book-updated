import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme as useSystemColorScheme } from 'react-native';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  themeMode: Theme;
  isDark: boolean;
  toggleTheme: () => void;
  setThemeMode: (mode: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  themeMode: 'system',
  isDark: false,
  toggleTheme: () => {},
  setThemeMode: () => {},
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const systemScheme = useSystemColorScheme();
  const [themeMode, setThemeModeState] = useState<Theme>('system');
  const [isDark, setIsDark] = useState(systemScheme === 'dark');

  useEffect(() => {
    loadTheme();
  }, []);

  useEffect(() => {
    const computedIsDark =
      themeMode === 'system' ? systemScheme === 'dark' : themeMode === 'dark';
    setIsDark(computedIsDark);
  }, [themeMode, systemScheme]);

  const loadTheme = async () => {
    try {
      const storedTheme = await AsyncStorage.getItem('themeMode');
      if (storedTheme) {
        setThemeModeState(storedTheme as Theme);
      }
    } catch (e) {
      console.error('Failed to load theme', e);
    }
  };

  const setThemeMode = async (mode: Theme) => {
    setThemeModeState(mode);
    try {
      await AsyncStorage.setItem('themeMode', mode);
    } catch (e) {
      console.error('Failed to save theme', e);
    }
  };

  const toggleTheme = () => {
    // Simple toggle between light and dark for the button
    // If system, we switch to the opposite of current system
    const nextMode = isDark ? 'light' : 'dark';
    setThemeMode(nextMode);
  };

  return (
    <ThemeContext.Provider value={{ themeMode, isDark, toggleTheme, setThemeMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => useContext(ThemeContext);
