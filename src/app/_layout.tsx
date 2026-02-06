import '../global.css';

import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Appearance } from 'react-native';
import 'react-native-reanimated';

import { SettingsProvider, useSettings } from '@/contexts/settings-context';
import { useColorScheme } from '@/hooks/use-color-scheme';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 60 * 24, // 24 hours
      retry: 2,
    },
  },
});

export const unstable_settings = {
  anchor: '(tabs)',
};

function RootInner() {
  const colorScheme = useColorScheme();
  const { settings } = useSettings();

  useEffect(() => {
    if (settings.themePreference === 'auto') {
      Appearance.setColorScheme(null);
    } else {
      Appearance.setColorScheme(settings.themePreference);
    }
  }, [settings.themePreference]);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="blog/[id]" options={{ headerLargeTitle: false }} />
      </Stack>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <SettingsProvider>
      <QueryClientProvider client={queryClient}>
        <RootInner />
      </QueryClientProvider>
    </SettingsProvider>
  );
}
