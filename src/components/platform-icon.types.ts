import type { StyleProp, ViewStyle } from 'react-native';

export interface PlatformIconProps {
  name: string;
  size?: number;
  tintColor?: string;
  style?: StyleProp<ViewStyle>;
  accessibilityElementsHidden?: boolean;
  importantForAccessibility?: 'auto' | 'yes' | 'no' | 'no-hide-descendants';
}
