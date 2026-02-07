import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router, Tabs, useSegments } from 'expo-router';
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
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#0a7ea4',
      }}
    >
      <Tabs.Screen
        name="(index)"
        options={{
          title: 'About',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="person" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="(blog)"
        options={{
          title: 'Blog',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="article" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="(portfolio)"
        options={{
          title: 'Portfolio',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="folder" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="(contact)"
        options={{
          title: 'Contact',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="email" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="(settings)"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="settings" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
