import { NativeTabs } from 'expo-router/unstable-native-tabs';

import { useTabPersistence } from '@/hooks/use-tab-persistence';

export default function TabLayout() {
  useTabPersistence();

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
