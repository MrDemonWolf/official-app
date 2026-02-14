import { router, useSegments } from 'expo-router';
import { NativeTabs } from 'expo-router/unstable-native-tabs';
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

export default function TabLayout() {
  const segments = useSegments();
  const { settings, setLastTab, isLoading } = useSettings();
  const hasRestored = useRef(false);

  // Restore last tab on cold launch
  useEffect(() => {
    if (!isLoading && !hasRestored.current) {
      hasRestored.current = true;
      if (settings.lastTab && settings.lastTab !== '(index)') {
        router.replace(`/(tabs)/${settings.lastTab}` as never);
      }
    }
  }, [isLoading, settings.lastTab]);

  // Save current tab when it changes
  useEffect(() => {
    const tabSegment = segments.find((s) => TAB_NAMES.has(s)) as TabName | undefined;
    if (tabSegment && tabSegment !== settings.lastTab) {
      setLastTab(tabSegment);
    }
  }, [segments, setLastTab, settings.lastTab]);

  return (
    <NativeTabs>
      <NativeTabs.Trigger name="(index)">
        <NativeTabs.Trigger.Icon sf="person.crop.circle" md="person" />
        <NativeTabs.Trigger.Label>About</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="(blog)">
        <NativeTabs.Trigger.Icon sf="doc.text" md="article" />
        <NativeTabs.Trigger.Label>Blog</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="(portfolio)">
        <NativeTabs.Trigger.Icon sf="folder" md="folder" />
        <NativeTabs.Trigger.Label>Portfolio</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="(contact)">
        <NativeTabs.Trigger.Icon sf="envelope" md="email" />
        <NativeTabs.Trigger.Label>Contact</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="(settings)">
        <NativeTabs.Trigger.Icon sf="gearshape" md="settings" />
        <NativeTabs.Trigger.Label>Settings</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
