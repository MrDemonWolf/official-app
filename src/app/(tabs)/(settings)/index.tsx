import { Pressable, ScrollView, Text, View } from 'react-native';

import { useSettings } from '@/contexts/settings-context';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { FONT_SCALES } from '@/lib/font-scale';
import type { FontSize, ThemePreference } from '@/types/settings';

const THEME_OPTIONS: { value: ThemePreference; label: string }[] = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'auto', label: 'Auto' },
];

const FONT_OPTIONS: { value: FontSize; label: string }[] = [
  { value: 'small', label: 'Small' },
  { value: 'medium', label: 'Medium' },
  { value: 'large', label: 'Large' },
];

function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  isDark,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  isDark: boolean;
}) {
  return (
    <View
      style={{
        flexDirection: 'row',
        borderRadius: 10,
        backgroundColor: isDark ? '#27272a' : '#f4f4f5',
        padding: 3,
      }}
    >
      {options.map((opt) => {
        const selected = opt.value === value;
        return (
          <Pressable
            key={opt.value}
            onPress={() => onChange(opt.value)}
            style={{
              flex: 1,
              paddingVertical: 8,
              borderRadius: 8,
              alignItems: 'center',
              backgroundColor: selected
                ? isDark
                  ? '#3f3f46'
                  : '#ffffff'
                : 'transparent',
              ...(selected && {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 2,
                elevation: 2,
              }),
            }}
          >
            <Text
              style={{
                fontSize: 14,
                fontWeight: selected ? '600' : '400',
                color: selected
                  ? isDark
                    ? '#f4f4f5'
                    : '#18181b'
                  : isDark
                    ? '#a1a1aa'
                    : '#71717a',
              }}
            >
              {opt.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export default function SettingsScreen() {
  const { settings, setThemePreference, setFontSize } = useSettings();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const scale = FONT_SCALES[settings.fontSize];

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{ padding: 16, gap: 24 }}
      className="bg-zinc-50 dark:bg-zinc-950"
    >
      {/* Appearance */}
      <View
        className="rounded-xl bg-white dark:bg-zinc-900"
        style={{ padding: 16, gap: 12, borderCurve: 'continuous' }}
      >
        <Text
          style={{
            fontSize: 13,
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: 0.5,
            color: isDark ? '#a1a1aa' : '#71717a',
          }}
        >
          Appearance
        </Text>
        <SegmentedControl
          options={THEME_OPTIONS}
          value={settings.themePreference}
          onChange={setThemePreference}
          isDark={isDark}
        />
      </View>

      {/* Reading */}
      <View
        className="rounded-xl bg-white dark:bg-zinc-900"
        style={{ padding: 16, gap: 12, borderCurve: 'continuous' }}
      >
        <Text
          style={{
            fontSize: 13,
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: 0.5,
            color: isDark ? '#a1a1aa' : '#71717a',
          }}
        >
          Reading
        </Text>
        <SegmentedControl
          options={FONT_OPTIONS}
          value={settings.fontSize}
          onChange={setFontSize}
          isDark={isDark}
        />
        <View
          style={{
            marginTop: 8,
            padding: 12,
            borderRadius: 8,
            backgroundColor: isDark ? '#18181b' : '#f4f4f5',
          }}
        >
          <Text
            style={{
              fontSize: scale.body,
              lineHeight: scale.body * scale.lineHeight,
              color: isDark ? '#d4d4d8' : '#3f3f46',
            }}
          >
            The quick brown fox jumps over the lazy dog. This is a preview of how blog content will
            appear at the selected font size.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
