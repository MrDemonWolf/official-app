import { useColorScheme as useSystemColorScheme } from 'react-native';

import { useSettings } from '@/contexts/settings-context';

export function useColorScheme() {
  const systemScheme = useSystemColorScheme();
  const { settings } = useSettings();

  if (settings.themePreference === 'auto') {
    return systemScheme;
  }

  return settings.themePreference;
}
