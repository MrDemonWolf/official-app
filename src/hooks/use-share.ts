import { useCallback } from 'react';
import { Share } from 'react-native';

import { useHaptics } from '@/hooks/use-haptics';

export function useShare() {
  const haptics = useHaptics();

  const shareContent = useCallback(
    async (title: string, url: string) => {
      try {
        await Share.share({
          title,
          message: url,
          url, // iOS uses url, Android uses message
        });
        haptics.selection();
      } catch {
        // User cancelled or share failed silently
      }
    },
    [haptics]
  );

  return { shareContent };
}
