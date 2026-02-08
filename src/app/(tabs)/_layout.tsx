import { router, useSegments } from 'expo-router';
import { NativeTabs, Icon, Label } from 'expo-router/unstable-native-tabs';
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
    <NativeTabs minimizeBehavior="onScrollDown">
      <NativeTabs.Trigger name="(index)">
        <Icon sf={{ default: 'person.crop.circle', selected: 'person.crop.circle.fill' }} />
        <Label>About</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="(blog)">
        <Icon sf={{ default: 'doc.text', selected: 'doc.text.fill' }} />
        <Label>Blog</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="(portfolio)">
        <Icon sf={{ default: 'folder', selected: 'folder.fill' }} />
        <Label>Portfolio</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="(contact)">
        <Icon sf={{ default: 'envelope', selected: 'envelope.fill' }} />
        <Label>Contact</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="(settings)">
        <Icon sf={{ default: 'gearshape', selected: 'gearshape.fill' }} />
        <Label>Settings</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
