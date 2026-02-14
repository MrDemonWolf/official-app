import 'expo-sqlite/localStorage/install';
import { createContext, use, useCallback, useEffect, useState } from 'react';

import type { FontSize, Settings, TabName, ThemePreference } from '@/types/settings';
import { DEFAULT_SETTINGS } from '@/types/settings';

const STORAGE_KEY = 'app_settings';

interface SettingsContextValue {
  settings: Settings;
  isLoading: boolean;
  setFontSize: (size: FontSize) => void;
  setThemePreference: (pref: ThemePreference) => void;
  setHapticsEnabled: (enabled: boolean) => void;
  setLastTab: (tab: TabName) => void;
  setNotificationsEnabled: (enabled: boolean) => void;
}

const SettingsContext = createContext<SettingsContextValue>({
  settings: DEFAULT_SETTINGS,
  isLoading: true,
  setFontSize: () => {},
  setThemePreference: () => {},
  setHapticsEnabled: () => {},
  setLastTab: () => {},
  setNotificationsEnabled: () => {},
});

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(raw) });
      } catch {
        // ignore bad data
      }
    }
    setIsLoading(false);
  }, []);

  const persist = useCallback((next: Settings) => {
    setSettings(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }, []);

  const setFontSize = useCallback(
    (fontSize: FontSize) => persist({ ...settings, fontSize }),
    [settings, persist]
  );

  const setThemePreference = useCallback(
    (themePreference: ThemePreference) => persist({ ...settings, themePreference }),
    [settings, persist]
  );

  const setHapticsEnabled = useCallback(
    (hapticsEnabled: boolean) => persist({ ...settings, hapticsEnabled }),
    [settings, persist]
  );

  const setLastTab = useCallback(
    (lastTab: TabName) => persist({ ...settings, lastTab }),
    [settings, persist]
  );

  const setNotificationsEnabled = useCallback(
    (notificationsEnabled: boolean) => persist({ ...settings, notificationsEnabled }),
    [settings, persist]
  );

  return (
    <SettingsContext
      value={{
        settings,
        isLoading,
        setFontSize,
        setThemePreference,
        setHapticsEnabled,
        setLastTab,
        setNotificationsEnabled,
      }}
    >
      {children}
    </SettingsContext>
  );
}

export function useSettings() {
  return use(SettingsContext);
}
