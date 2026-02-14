import { Stack } from 'expo-router/stack';

const isIOS = process.env.EXPO_OS === 'ios';

export default function BlogStack() {
  return (
    <Stack
      screenOptions={{
        ...(isIOS && {
          headerTransparent: true,
          headerLargeTitle: true,
          headerLargeStyle: { backgroundColor: 'transparent' },
          headerShadowVisible: false,
          headerLargeTitleShadowVisible: false,
          headerBlurEffect: 'systemUltraThinMaterial',
        }),
        headerBackButtonDisplayMode: 'minimal',
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Blog' }} />
      <Stack.Screen name="bookmarks" options={{ title: 'Bookmarks', headerLargeTitle: false }} />
    </Stack>
  );
}
