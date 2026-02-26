import 'expo-sqlite/localStorage/install';
import { createContext, use, useState } from 'react';

import type { FontSize, Settings, TabName, ThemePreference } from '@/types/settings';
import { DEFAULT_SETTINGS } from '@/types/settings';

export const STORAGE_KEY = 'app_settings';

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

  const update = (patch: Partial<Settings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  const setFontSize = (fontSize: FontSize) => update({ fontSize });
  const setThemePreference = (themePreference: ThemePreference) => update({ themePreference });
  const setHapticsEnabled = (hapticsEnabled: boolean) => update({ hapticsEnabled });
  const setLastTab = (lastTab: TabName) => update({ lastTab });
  const setNotificationsEnabled = (notificationsEnabled: boolean) => update({ notificationsEnabled });

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
