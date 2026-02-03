import { NativeTabs, Icon, Label } from 'expo-router/unstable-native-tabs';

export default function TabLayout() {
  return (
    <NativeTabs minimizeBehavior="onScrollDown">
      <NativeTabs.Trigger name="(index)">
        <Icon sf={{ default: 'house', selected: 'house.fill' }} />
        <Label>Home</Label>
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
    </NativeTabs>
  );
}
