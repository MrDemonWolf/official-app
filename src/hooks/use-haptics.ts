import * as Haptics from 'expo-haptics';
import { useCallback } from 'react';

import { useSettings } from '@/contexts/settings-context';

const isIOS = process.env.EXPO_OS === 'ios';

export function useHaptics() {
  const { settings } = useSettings();

  const impact = useCallback(
    (style: Haptics.ImpactFeedbackStyle = Haptics.ImpactFeedbackStyle.Medium) => {
      if (isIOS && settings.hapticsEnabled) {
        Haptics.impactAsync(style);
      }
    },
    [settings.hapticsEnabled]
  );

  const selection = useCallback(() => {
    if (isIOS && settings.hapticsEnabled) {
      Haptics.selectionAsync();
    }
  }, [settings.hapticsEnabled]);

  const notification = useCallback(
    (type: Haptics.NotificationFeedbackType = Haptics.NotificationFeedbackType.Success) => {
      if (isIOS && settings.hapticsEnabled) {
        Haptics.notificationAsync(type);
      }
    },
    [settings.hapticsEnabled]
  );

  return { impact, selection, notification };
}
