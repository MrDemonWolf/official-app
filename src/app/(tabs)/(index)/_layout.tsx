import { Stack } from 'expo-router/stack';

import { defaultStackScreenOptions } from '@/lib/stack-options';

const isIOS = process.env.EXPO_OS === 'ios';

export default function HomeStack() {
  return (
    <Stack screenOptions={defaultStackScreenOptions}>
      <Stack.Screen
        name="index"
        options={{
          title: 'About',
          ...(isIOS && {
            headerLargeTitle: false,
            headerTransparent: true,
          }),
          scrollEdgeEffects: isIOS ? {} : undefined,
        }}
      />
    </Stack>
  );
}
