import type { ComponentProps } from 'react';
import type { Stack } from 'expo-router/stack';

const isIOS = process.env.EXPO_OS === 'ios';

export const defaultStackScreenOptions: ComponentProps<typeof Stack>['screenOptions'] = {
  ...(isIOS && {
    headerTransparent: true,
    headerLargeTitle: true,
    headerLargeStyle: { backgroundColor: 'transparent' },
    headerShadowVisible: false,
    headerLargeTitleShadowVisible: false,
    scrollEdgeEffects: { top: 'automatic' },
  }),
  headerBackButtonDisplayMode: 'minimal',
};
