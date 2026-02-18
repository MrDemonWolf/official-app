import { SymbolView } from 'expo-symbols';

import type { PlatformIconProps } from './platform-icon.types';

export function PlatformIcon({
  name,
  size = 24,
  tintColor,
  style,
  accessibilityElementsHidden,
  importantForAccessibility,
}: PlatformIconProps) {
  return (
    <SymbolView
      name={name as any}
      size={size}
      tintColor={tintColor}
      resizeMode="scaleAspectFit"
      style={style ?? { width: size, height: size }}
      accessibilityElementsHidden={accessibilityElementsHidden}
      importantForAccessibility={importantForAccessibility}
    />
  );
}
