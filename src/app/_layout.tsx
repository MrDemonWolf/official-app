import '../global.css';
import 'expo-sqlite/localStorage/install';

import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useLayoutEffect } from 'react';
import { Appearance } from 'react-native';
import { colorScheme as nativewindColorScheme } from 'react-native-css';
import 'react-native-reanimated';

import { STORAGE_KEY, SettingsProvider, useSettings } from '@/contexts/settings-context';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useNotifications } from '@/hooks/use-notifications';
import { initializeAppCheck } from '@/services/app-check';

// Read stored theme preference at module level so NativeWind is seeded
// before the first render — avoids a flash of wrong theme colors.
const storedRaw = localStorage.getItem(STORAGE_KEY);
const systemScheme = Appearance.getColorScheme();
let initialScheme: 'light' | 'dark' = systemScheme === 'dark' ? 'dark' : 'light';
if (storedRaw) {
  try {
    const stored = JSON.parse(storedRaw);
    if (stored.themePreference === 'light' || stored.themePreference === 'dark') {
      initialScheme = stored.themePreference;
    }
  } catch {}
}
nativewindColorScheme.set(initialScheme);

// Initialize Firebase App Check with native device attestation
initializeAppCheck();

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
  useNotifications();

  useLayoutEffect(() => {
    if (settings.themePreference === 'auto') {
      Appearance.setColorScheme('unspecified');
    } else {
      Appearance.setColorScheme(settings.themePreference);
    }
  }, [settings.themePreference]);

  useLayoutEffect(() => {
    nativewindColorScheme.set(colorScheme ?? Appearance.getColorScheme() ?? 'light');
  }, [colorScheme]);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack
        screenOptions={{
          headerBackButtonDisplayMode: 'minimal',
          contentStyle: {
            backgroundColor: colorScheme === 'dark' ? '#09090b' : '#fafafa',
          },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="blog/[id]" options={{ headerLargeTitle: false }} />
        <Stack.Screen name="portfolio/[id]" options={{ headerLargeTitle: false }} />
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
