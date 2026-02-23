import { Stack } from 'expo-router/stack';

import { defaultStackScreenOptions } from '@/lib/stack-options';

export default function ContactStack() {
  return (
    <Stack screenOptions={defaultStackScreenOptions}>
      <Stack.Screen name="index" options={{ title: 'Contact' }} />
    </Stack>
  );
}
