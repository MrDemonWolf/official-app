import { NativeTabs } from 'expo-router/unstable-native-tabs';

import { useTabPersistence } from '@/hooks/use-tab-persistence';

export default function TabLayout() {
  useTabPersistence();

  return (
    <NativeTabs minimizeBehavior="onScrollDown">
      <NativeTabs.Trigger name="(index)">
        <NativeTabs.Trigger.Icon sf={{ default: 'person.crop.circle', selected: 'person.crop.circle.fill' }} />
        <NativeTabs.Trigger.Label>About</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="(blog)">
        <NativeTabs.Trigger.Icon sf={{ default: 'doc.text', selected: 'doc.text.fill' }} />
        <NativeTabs.Trigger.Label>Blog</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="(portfolio)">
        <NativeTabs.Trigger.Icon sf={{ default: 'folder', selected: 'folder.fill' }} />
        <NativeTabs.Trigger.Label>Portfolio</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="(contact)">
        <NativeTabs.Trigger.Icon sf={{ default: 'envelope', selected: 'envelope.fill' }} />
        <NativeTabs.Trigger.Label>Contact</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="(settings)">
        <NativeTabs.Trigger.Icon sf={{ default: 'gearshape', selected: 'gearshape.fill' }} />
        <NativeTabs.Trigger.Label>Settings</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
