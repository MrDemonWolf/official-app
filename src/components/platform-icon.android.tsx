import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import type { PlatformIconProps } from './platform-icon.types';

const SF_TO_MATERIAL: Record<string, string> = {
  'bookmark': 'bookmark-outline',
  'bookmark.fill': 'bookmark',
  'hammer.fill': 'construction',
  'doc.text': 'article',
  'square.and.arrow.up': 'share',
  'globe': 'language',
};

export function PlatformIcon({
  name,
  size = 24,
  tintColor,
  style,
  accessibilityElementsHidden,
  importantForAccessibility,
}: PlatformIconProps) {
  const materialName = SF_TO_MATERIAL[name] ?? 'help-outline';

  return (
    <MaterialIcons
      name={materialName as any}
      size={size}
      color={tintColor}
      style={style as any}
      accessibilityElementsHidden={accessibilityElementsHidden}
      importantForAccessibility={importantForAccessibility}
    />
  );
}
