import { Stack } from 'expo-router/stack';

import { defaultStackScreenOptions } from '@/lib/stack-options';

export default function BlogStack() {
  return (
    <Stack screenOptions={defaultStackScreenOptions}>
      <Stack.Screen name="index" options={{ title: 'Blog' }} />
      <Stack.Screen name="bookmarks" options={{ title: 'Bookmarks', headerLargeTitle: false }} />
    </Stack>
  );
}
