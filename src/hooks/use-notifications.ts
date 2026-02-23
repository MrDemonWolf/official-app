import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';
import { useEffect, useRef } from 'react';

import { useSettings } from '@/contexts/settings-context';
import {
  registerDevice,
  registerForPushNotifications,
  unregisterDevice,
} from '@/services/notifications';

export function useNotifications() {
  const { settings } = useSettings();
  const responseListener = useRef<Notifications.EventSubscription | null>(null);
  const tokenRef = useRef<string | null>(null);

  useEffect(() => {
    if (!settings.notificationsEnabled) {
      // If notifications were just disabled and we have a stored token, unregister
      if (tokenRef.current) {
        unregisterDevice(tokenRef.current);
        tokenRef.current = null;
      }
      return;
    }

    registerForPushNotifications()
      .then((token) => {
        if (token) {
          tokenRef.current = token;
          registerDevice(token);
        }
      })
      .catch(() => {});

    // Handle notification taps — navigate to the relevant post
    responseListener.current = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const data = response.notification.request.content.data;
        const postId = data?.post_id ?? data?.postId;
        if (postId) {
          const id = String(postId);
          const postType = data?.post_type ?? data?.postType;
          if (postType === 'portfolio' || postType === 'project') {
            router.push(`/portfolio/${id}` as any);
          } else {
            router.push(`/blog/${id}`);
          }
        }
      }
    );

    return () => {
      if (responseListener.current) {
        responseListener.current.remove();
      }
    };
  }, [settings.notificationsEnabled]);
}
