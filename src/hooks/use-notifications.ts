import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';
import { useEffect, useRef } from 'react';

import { useSettings } from '@/contexts/settings-context';
import { registerForPushNotifications, sendPushTokenToServer } from '@/services/notifications';

export function useNotifications() {
  const { settings } = useSettings();
  const responseListener = useRef<Notifications.EventSubscription | null>(null);

  useEffect(() => {
    if (!settings.notificationsEnabled) return;

    registerForPushNotifications().then((token) => {
      if (token) {
        sendPushTokenToServer(token);
      }
    });

    // Handle notification taps — navigate to the relevant post
    responseListener.current = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const data = response.notification.request.content.data;
        if (data?.postId) {
          const postId = String(data.postId);
          if (data.postType === 'portfolio') {
            router.push(`/portfolio/${postId}` as any);
          } else {
            router.push(`/blog/${postId}`);
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
