import Constants from 'expo-constants';
import { useCallback, useEffect, useState } from 'react';
import { Alert, type LayoutChangeEvent, Pressable, ScrollView, Switch, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useQueryClient } from '@tanstack/react-query';

import { useSettings } from '@/contexts/settings-context';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useHaptics } from '@/hooks/use-haptics';
import { FONT_SCALES } from '@/lib/font-scale';
import type { FontSize, ThemePreference } from '@/types/settings';

const isIOS = process.env.EXPO_OS === 'ios';
const APP_VERSION = Constants.expoConfig?.version ?? '1.0.0';

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
  const haptics = useHaptics();
  const selectedIndex = options.findIndex((o) => o.value === value);
  const [segmentWidth, setSegmentWidth] = useState(0);
  const indicatorX = useSharedValue(0);

  const handleLayout = useCallback(
    (e: LayoutChangeEvent) => {
      const width = e.nativeEvent.layout.width / options.length;
      setSegmentWidth(width);
      indicatorX.value = selectedIndex * width;
    },
    [options.length, selectedIndex, indicatorX]
  );

  useEffect(() => {
    if (segmentWidth > 0) {
      indicatorX.value = withSpring(selectedIndex * segmentWidth, {
        damping: 20,
        stiffness: 300,
        mass: 0.8,
      });
    }
  }, [selectedIndex, segmentWidth, indicatorX]);

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: indicatorX.value }],
  }));

  return (
    <View
      style={{
        borderRadius: 10,
        backgroundColor: isDark ? '#27272a' : '#f4f4f5',
        padding: 3,
      }}
    >
      <View onLayout={handleLayout} style={{ position: 'relative' }}>
        {segmentWidth > 0 && (
          <Animated.View
            style={[
              {
                position: 'absolute',
                top: 0,
                bottom: 0,
                width: segmentWidth,
                borderRadius: 8,
                backgroundColor: isDark ? '#3f3f46' : '#ffffff',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
              },
              indicatorStyle,
            ]}
          />
        )}
        <View style={{ flexDirection: 'row' }}>
          {options.map((opt) => {
            const selected = opt.value === value;
            return (
              <Pressable
                key={opt.value}
                onPress={() => {
                  haptics.selection();
                  onChange(opt.value);
                }}
                style={{
                  flex: 1,
                  paddingVertical: 8,
                  alignItems: 'center',
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
      </View>
    </View>
  );
}

export default function SettingsScreen() {
  const { settings, setThemePreference, setFontSize, setHapticsEnabled } = useSettings();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const scale = FONT_SCALES[settings.fontSize];
  const queryClient = useQueryClient();
  const haptics = useHaptics();

  const handleClearCache = useCallback(() => {
    Alert.alert(
      'Clear Cache',
      'This will clear all cached data. The app will re-fetch content from the server.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            queryClient.clear();
            haptics.notification();
          },
        },
      ]
    );
  }, [queryClient, haptics]);

  const sectionHeaderStyle = {
    fontSize: 13,
    fontWeight: '600' as const,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.5,
    color: isDark ? '#a1a1aa' : '#71717a',
  };

  const cardStyle = {
    padding: 16,
    gap: 12,
    borderCurve: 'continuous' as const,
  };

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{ padding: 16, gap: 24, paddingBottom: 40 }}
      className="bg-zinc-50 dark:bg-zinc-950"
    >
      {/* Appearance */}
      <View className="rounded-xl bg-white dark:bg-zinc-900" style={cardStyle}>
        <Text style={sectionHeaderStyle}>Appearance</Text>
        <SegmentedControl
          options={THEME_OPTIONS}
          value={settings.themePreference}
          onChange={setThemePreference}
          isDark={isDark}
        />
      </View>

      {/* Reading */}
      <View className="rounded-xl bg-white dark:bg-zinc-900" style={cardStyle}>
        <Text style={sectionHeaderStyle}>Reading</Text>
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

      {/* Haptics - iOS only */}
      {isIOS && (
        <View className="rounded-xl bg-white dark:bg-zinc-900" style={cardStyle}>
          <Text style={sectionHeaderStyle}>Haptics</Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 16, color: isDark ? '#f4f4f5' : '#18181b' }}>
                Haptic Feedback
              </Text>
              <Text style={{ fontSize: 13, color: isDark ? '#71717a' : '#a1a1aa', marginTop: 2 }}>
                Vibration on taps and interactions
              </Text>
            </View>
            <Switch value={settings.hapticsEnabled} onValueChange={setHapticsEnabled} />
          </View>
        </View>
      )}

      {/* Data */}
      <View className="rounded-xl bg-white dark:bg-zinc-900" style={cardStyle}>
        <Text style={sectionHeaderStyle}>Data</Text>
        <Pressable
          onPress={handleClearCache}
          style={({ pressed }) => ({
            padding: 12,
            borderRadius: 10,
            backgroundColor: isDark ? '#18181b' : '#f4f4f5',
            opacity: pressed ? 0.7 : 1,
          })}
        >
          <Text style={{ fontSize: 16, color: '#ef4444' }}>Clear Cache</Text>
        </Pressable>
      </View>

      {/* About */}
      <View className="rounded-xl bg-white dark:bg-zinc-900" style={cardStyle}>
        <Text style={sectionHeaderStyle}>About</Text>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Text style={{ fontSize: 16, color: isDark ? '#f4f4f5' : '#18181b' }}>Version</Text>
          <Text style={{ fontSize: 16, color: isDark ? '#71717a' : '#a1a1aa' }} selectable>
            {APP_VERSION}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
