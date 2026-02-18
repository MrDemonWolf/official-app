import { ImpactFeedbackStyle } from 'expo-haptics';
import { useCallback } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { useHaptics } from '@/hooks/use-haptics';
import type { WPCategory } from '@/types/wordpress';

interface CategoryFilterProps {
  categories: WPCategory[];
  selectedId: number | null;
  onSelect: (id: number | null) => void;
}

export function CategoryFilter({ categories, selectedId, onSelect }: CategoryFilterProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const haptics = useHaptics();

  const handlePress = useCallback(
    (id: number | null) => {
      haptics.impact(ImpactFeedbackStyle.Light);
      onSelect(id);
    },
    [haptics, onSelect]
  );

  const filtered = categories.filter((c) => c.count > 0);
  if (filtered.length === 0) return null;

  return (
    <View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 8, paddingHorizontal: 4, paddingVertical: 4 }}
      >
        <Pressable
          onPress={() => handlePress(null)}
          accessibilityRole="button"
          accessibilityLabel="All categories"
          accessibilityState={{ selected: selectedId === null }}
          style={{
            paddingHorizontal: 14,
            paddingVertical: 7,
            borderRadius: 20,
            backgroundColor:
              selectedId === null
                ? '#3b82f6'
                : isDark
                  ? '#27272a'
                  : '#f4f4f5',
          }}
        >
          <Text
            style={{
              fontSize: 14,
              fontWeight: '500',
              color:
                selectedId === null
                  ? '#ffffff'
                  : isDark
                    ? '#a1a1aa'
                    : '#71717a',
            }}
          >
            All
          </Text>
        </Pressable>
        {filtered.map((category) => {
          const isSelected = selectedId === category.id;
          return (
            <Pressable
              key={category.id}
              onPress={() => handlePress(category.id)}
              accessibilityRole="button"
              accessibilityLabel={category.name}
              accessibilityState={{ selected: isSelected }}
              style={{
                paddingHorizontal: 14,
                paddingVertical: 7,
                borderRadius: 20,
                backgroundColor: isSelected
                  ? '#3b82f6'
                  : isDark
                    ? '#27272a'
                    : '#f4f4f5',
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: '500',
                  color: isSelected
                    ? '#ffffff'
                    : isDark
                      ? '#a1a1aa'
                      : '#71717a',
                }}
              >
                {category.name}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}
