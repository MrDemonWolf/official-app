import { router, useSegments } from 'expo-router';
import { useEffect, useRef } from 'react';

import { useSettings } from '@/contexts/settings-context';
import type { TabName } from '@/types/settings';

const TAB_NAMES = new Set<string>([
  '(index)',
  '(blog)',
  '(portfolio)',
  '(contact)',
  '(settings)',
]);

export function useTabPersistence() {
  const segments = useSegments();
  const { settings, setLastTab } = useSettings();
  const hasRestored = useRef(false);

  // Restore last tab on cold launch
  useEffect(() => {
    if (!hasRestored.current) {
      hasRestored.current = true;
      if (settings.lastTab && settings.lastTab !== '(index)') {
        router.replace(`/(tabs)/${settings.lastTab}` as never);
      }
    }
  }, [settings.lastTab]);

  // Save current tab when it changes
  useEffect(() => {
    const tabSegment = segments.find((s) => TAB_NAMES.has(s)) as TabName | undefined;
    if (tabSegment && tabSegment !== settings.lastTab) {
      setLastTab(tabSegment);
    }
  }, [segments, setLastTab, settings.lastTab]);
}
