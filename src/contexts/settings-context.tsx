import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';

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
}

const SettingsContext = createContext<SettingsContextValue>({
  settings: DEFAULT_SETTINGS,
  isLoading: true,
  setFontSize: () => {},
  setThemePreference: () => {},
  setHapticsEnabled: () => {},
  setLastTab: () => {},
});

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((raw) => {
      if (raw) {
        try {
          setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(raw) });
        } catch {
          // ignore bad data
        }
      }
      setIsLoading(false);
    });
  }, []);

  const persist = useCallback((next: Settings) => {
    setSettings(next);
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
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

  return (
    <SettingsContext.Provider
      value={{ settings, isLoading, setFontSize, setThemePreference, setHapticsEnabled, setLastTab }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}
