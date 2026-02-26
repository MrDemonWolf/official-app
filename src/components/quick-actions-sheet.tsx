import { router } from 'expo-router';
import {
  Alert,
  Modal,
  Pressable,
  Switch,
  Text,
  View,
} from 'react-native';
import { useQueryClient } from '@tanstack/react-query';

import { PlatformIcon } from '@/components/platform-icon';
import { useSettings } from '@/contexts/settings-context';
import { useColorScheme } from '@/hooks/use-color-scheme';

import type { FontSize } from '@/types/settings';

interface QuickActionsSheetProps {
  visible: boolean;
  onClose: () => void;
  showBookmarks?: boolean;
}

const FONT_SIZES: { label: string; value: FontSize }[] = [
  { label: 'Small', value: 'small' },
  { label: 'Medium', value: 'medium' },
  { label: 'Large', value: 'large' },
];

export function QuickActionsSheet({ visible, onClose, showBookmarks }: QuickActionsSheetProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { settings, setFontSize, setNotificationsEnabled } = useSettings();
  const queryClient = useQueryClient();

  const bgColor = isDark ? '#18181b' : '#ffffff';
  const textColor = isDark ? '#f4f4f5' : '#18181b';
  const mutedColor = isDark ? '#a1a1aa' : '#71717a';
  const dividerColor = isDark ? '#27272a' : '#e4e4e7';

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      {/* Scrim */}
      <Pressable
        style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' }}
        onPress={onClose}
      />

      {/* Sheet */}
      <View
        style={{
          backgroundColor: bgColor,
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          paddingTop: 12,
          paddingBottom: 32,
          paddingHorizontal: 16,
        }}
      >
        {/* Handle */}
        <View
          style={{
            width: 36,
            height: 4,
            borderRadius: 2,
            backgroundColor: dividerColor,
            alignSelf: 'center',
            marginBottom: 16,
          }}
        />

        {/* Bookmarks row */}
        {showBookmarks && (
          <>
            <Pressable
              onPress={() => {
                onClose();
                router.push('/bookmarks' as any);
              }}
              style={({ pressed }) => ({
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 14,
                opacity: pressed ? 0.6 : 1,
              })}
            >
              <PlatformIcon name="bookmark" size={22} tintColor={textColor} />
              <Text style={{ fontSize: 16, color: textColor, marginLeft: 12 }}>
                Bookmarks
              </Text>
            </Pressable>
            <View style={{ height: 1, backgroundColor: dividerColor }} />
          </>
        )}

        {/* Font Size */}
        <View style={{ paddingVertical: 14 }}>
          <Text style={{ fontSize: 13, color: mutedColor, marginBottom: 10, fontWeight: '600' }}>
            Font Size
          </Text>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {FONT_SIZES.map((fs) => {
              const isActive = settings.fontSize === fs.value;
              return (
                <Pressable
                  key={fs.value}
                  onPress={() => setFontSize(fs.value)}
                  style={{
                    flex: 1,
                    paddingVertical: 8,
                    borderRadius: 8,
                    backgroundColor: isActive
                      ? (isDark ? '#3b82f6' : '#3b82f6')
                      : (isDark ? '#27272a' : '#f4f4f5'),
                    alignItems: 'center',
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: '500',
                      color: isActive ? '#ffffff' : textColor,
                    }}
                  >
                    {fs.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={{ height: 1, backgroundColor: dividerColor }} />

        {/* Notifications toggle */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingVertical: 14,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <PlatformIcon
              name={settings.notificationsEnabled ? 'bell.fill' : 'bell'}
              size={22}
              tintColor={textColor}
            />
            <Text style={{ fontSize: 16, color: textColor, marginLeft: 12 }}>
              Notifications
            </Text>
          </View>
          <Switch
            value={settings.notificationsEnabled}
            onValueChange={setNotificationsEnabled}
          />
        </View>

        <View style={{ height: 1, backgroundColor: dividerColor }} />

        {/* Clear Cache */}
        <Pressable
          onPress={() => {
            Alert.alert(
              'Clear Cache',
              'This will clear all cached data. Are you sure?',
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Clear',
                  style: 'destructive',
                  onPress: () => {
                    queryClient.clear();
                    onClose();
                  },
                },
              ],
            );
          }}
          style={({ pressed }) => ({
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 14,
            opacity: pressed ? 0.6 : 1,
          })}
        >
          <PlatformIcon name="arrow.clockwise" size={22} tintColor="#ef4444" />
          <Text style={{ fontSize: 16, color: '#ef4444', marginLeft: 12 }}>
            Clear Cache
          </Text>
        </Pressable>
      </View>
    </Modal>
  );
}
