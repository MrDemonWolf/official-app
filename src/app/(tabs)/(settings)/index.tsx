import SegmentedControl from '@react-native-segmented-control/segmented-control';
import Constants from 'expo-constants';
import { useCallback } from 'react';
import { Alert, Pressable, ScrollView, Switch, Text, View } from 'react-native';
import { useQueryClient } from '@tanstack/react-query';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { useSettings } from '@/contexts/settings-context';
import { useClearBookmarks } from '@/hooks/use-bookmarks';
import { useHaptics } from '@/hooks/use-haptics';
import { FONT_SCALES } from '@/lib/font-scale';
import type { FontSize, ThemePreference } from '@/types/settings';

const isIOS = process.env.EXPO_OS === 'ios';
const APP_VERSION = Constants.expoConfig?.version ?? '1.0.0';
const BUILD_NUMBER =
  (isIOS
    ? Constants.expoConfig?.ios?.buildNumber
    : Constants.expoConfig?.android?.versionCode?.toString()) ?? '1';
const COPYRIGHT_YEAR = new Date().getFullYear();

const THEME_LABELS = ['Light', 'Auto', 'Dark'];
const THEME_VALUES: ThemePreference[] = ['light', 'auto', 'dark'];

const FONT_LABELS = ['Small', 'Medium', 'Large'];
const FONT_VALUES: FontSize[] = ['small', 'medium', 'large'];

export default function SettingsScreen() {
  const { settings, setThemePreference, setFontSize, setHapticsEnabled, setNotificationsEnabled } = useSettings();
  const scale = FONT_SCALES[settings.fontSize];
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const queryClient = useQueryClient();
  const haptics = useHaptics();
  const clearBookmarks = useClearBookmarks();

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

  const handleClearBookmarks = useCallback(() => {
    Alert.alert(
      'Clear Bookmarks',
      'This will remove all your saved bookmarks. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: () => {
            clearBookmarks.mutate();
            haptics.notification();
          },
        },
      ]
    );
  }, [clearBookmarks, haptics]);

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{ padding: 16, gap: 24, paddingBottom: 40 }}
      className="bg-zinc-50 dark:bg-zinc-950"
    >
      {/* Appearance */}
      <View className="rounded-xl bg-white dark:bg-zinc-900" style={{ padding: 16, gap: 12, borderCurve: 'continuous' }}>
        <Text className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
          Appearance
        </Text>
        <SegmentedControl
          values={THEME_LABELS}
          selectedIndex={THEME_VALUES.indexOf(settings.themePreference)}
          onChange={({ nativeEvent }) => setThemePreference(THEME_VALUES[nativeEvent.selectedSegmentIndex])}
        />
      </View>

      {/* Reading */}
      <View className="rounded-xl bg-white dark:bg-zinc-900" style={{ padding: 16, gap: 12, borderCurve: 'continuous' }}>
        <Text className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
          Reading
        </Text>
        <SegmentedControl
          values={FONT_LABELS}
          selectedIndex={FONT_VALUES.indexOf(settings.fontSize)}
          onChange={({ nativeEvent }) => setFontSize(FONT_VALUES[nativeEvent.selectedSegmentIndex])}
        />
        <View
          style={{
            marginTop: 8,
            borderRadius: 8,
            padding: 12,
            backgroundColor: isDark ? '#27272a' : '#f4f4f5',
          }}
        >
          <Text
            style={{
              fontSize: scale.body,
              lineHeight: scale.body * scale.lineHeight,
              color: isDark ? '#e4e4e7' : '#3f3f46',
            }}
          >
            The quick brown fox jumps over the lazy dog. This is a preview of how blog content will
            appear at the selected font size.
          </Text>
        </View>
      </View>

      {/* Haptics - iOS only */}
      {isIOS && (
        <View className="rounded-xl bg-white dark:bg-zinc-900" style={{ padding: 16, gap: 12, borderCurve: 'continuous' }}>
          <Text className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            Haptics
          </Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View style={{ flex: 1 }}>
              <Text className="text-base text-zinc-900 dark:text-zinc-100">
                Haptic Feedback
              </Text>
              <Text className="mt-0.5 text-[13px] text-zinc-400 dark:text-zinc-500">
                Vibration on taps and interactions
              </Text>
            </View>
            <Switch value={settings.hapticsEnabled} onValueChange={setHapticsEnabled} />
          </View>
        </View>
      )}

      {/* Notifications */}
      <View className="rounded-xl bg-white dark:bg-zinc-900" style={{ padding: 16, gap: 12, borderCurve: 'continuous' }}>
        <Text className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
          Notifications
        </Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View style={{ flex: 1 }}>
            <Text className="text-base text-zinc-900 dark:text-zinc-100">
              Push Notifications
            </Text>
            <Text className="mt-0.5 text-[13px] text-zinc-400 dark:text-zinc-500">
              Get notified about new posts
            </Text>
          </View>
          <Switch value={settings.notificationsEnabled} onValueChange={setNotificationsEnabled} />
        </View>
      </View>

      {/* Data */}
      <View className="rounded-xl bg-white dark:bg-zinc-900" style={{ padding: 16, gap: 12, borderCurve: 'continuous' }}>
        <Text className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
          Data
        </Text>
        <Pressable
          onPress={handleClearCache}
          style={({ pressed }) => ({
            padding: 12,
            borderRadius: 10,
            backgroundColor: isDark ? '#27272a' : '#f4f4f5',
            opacity: pressed ? 0.7 : 1,
          })}
        >
          <Text style={{ fontSize: 16, color: '#ef4444' }}>Clear Cache</Text>
        </Pressable>
        <Pressable
          onPress={handleClearBookmarks}
          style={({ pressed }) => ({
            padding: 12,
            borderRadius: 10,
            backgroundColor: isDark ? '#27272a' : '#f4f4f5',
            opacity: pressed ? 0.7 : 1,
          })}
        >
          <Text style={{ fontSize: 16, color: '#ef4444' }}>Clear Bookmarks</Text>
        </Pressable>
      </View>

      {/* About */}
      <View className="rounded-xl bg-white dark:bg-zinc-900" style={{ padding: 16, gap: 12, borderCurve: 'continuous' }}>
        <Text className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
          About
        </Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text className="text-base text-zinc-900 dark:text-zinc-100">Version</Text>
          <Text className="text-base text-zinc-400 dark:text-zinc-500" selectable>
            {APP_VERSION}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text className="text-base text-zinc-900 dark:text-zinc-100">Build</Text>
          <Text className="text-base text-zinc-400 dark:text-zinc-500" selectable>
            {BUILD_NUMBER}
          </Text>
        </View>
        <View className="my-1 h-px bg-zinc-200 dark:bg-zinc-800" />
        <Text className="text-center text-[13px] text-zinc-400 dark:text-zinc-500">
          {'\u00A9'} {COPYRIGHT_YEAR} MrDemonWolf. All rights reserved.
        </Text>
      </View>
    </ScrollView>
  );
}
