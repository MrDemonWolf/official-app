import { useCallback } from 'react';
import { Share } from 'react-native';

import { useHaptics } from '@/hooks/use-haptics';

export function useShare() {
  const haptics = useHaptics();

  const shareContent = useCallback(
    async (title: string, url: string) => {
      try {
        await Share.share(
          process.env.EXPO_OS === 'ios'
            ? { title, url }
            : { title, message: url }
        );
        haptics.selection();
      } catch {
        // User cancelled or share failed silently
      }
    },
    [haptics]
  );

  return { shareContent };
}
