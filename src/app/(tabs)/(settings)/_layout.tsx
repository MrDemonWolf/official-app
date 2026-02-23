import { Stack } from 'expo-router/stack';

import { defaultStackScreenOptions } from '@/lib/stack-options';

export default function SettingsStack() {
  return (
    <Stack screenOptions={defaultStackScreenOptions}>
      <Stack.Screen name="index" options={{ title: 'Settings' }} />
    </Stack>
  );
}
