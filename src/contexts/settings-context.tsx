import 'expo-sqlite/localStorage/install';
import { createContext, use, useCallback, useState } from 'react';

import type { FontSize, Settings, TabName, ThemePreference } from '@/types/settings';
import { DEFAULT_SETTINGS } from '@/types/settings';

const STORAGE_KEY = 'app_settings';

interface SettingsContextValue {
  settings: Settings;
  setFontSize: (size: FontSize) => void;
  setThemePreference: (pref: ThemePreference) => void;
  setHapticsEnabled: (enabled: boolean) => void;
  setLastTab: (tab: TabName) => void;
  setNotificationsEnabled: (enabled: boolean) => void;
}

const SettingsContext = createContext<SettingsContextValue>({
  settings: DEFAULT_SETTINGS,
  setFontSize: () => {},
  setThemePreference: () => {},
  setHapticsEnabled: () => {},
  setLastTab: () => {},
  setNotificationsEnabled: () => {},
});

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
      } catch {
        // ignore bad data
      }
    }
    return DEFAULT_SETTINGS;
  });

  const update = useCallback((patch: Partial<Settings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const setFontSize = useCallback((fontSize: FontSize) => update({ fontSize }), [update]);
  const setThemePreference = useCallback((themePreference: ThemePreference) => update({ themePreference }), [update]);
  const setHapticsEnabled = useCallback((hapticsEnabled: boolean) => update({ hapticsEnabled }), [update]);
  const setLastTab = useCallback((lastTab: TabName) => update({ lastTab }), [update]);
  const setNotificationsEnabled = useCallback((notificationsEnabled: boolean) => update({ notificationsEnabled }), [update]);

  return (
    <SettingsContext
      value={{
        settings,
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
