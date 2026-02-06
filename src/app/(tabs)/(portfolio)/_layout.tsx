import { Stack } from 'expo-router/stack';

const isIOS = process.env.EXPO_OS === 'ios';

export default function PortfolioStack() {
  return (
    <Stack
      screenOptions={{
        ...(isIOS && {
          headerTransparent: true,
          headerLargeTitle: true,
          headerLargeStyle: { backgroundColor: 'transparent' },
          headerShadowVisible: false,
          headerLargeTitleShadowVisible: false,
          headerBlurEffect: 'none',
        }),
        headerBackButtonDisplayMode: 'minimal',
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Portfolio' }} />
    </Stack>
  );
}
