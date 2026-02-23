import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';

const TAILSIGNAL_API_URL = process.env.EXPO_PUBLIC_TAILSIGNAL_API_URL;

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function registerForPushNotifications(): Promise<string | null> {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    return null;
  }

  if (process.env.EXPO_OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'Default',
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }

  const tokenData = await Notifications.getExpoPushTokenAsync({
    projectId: '4a220b17-d746-48f1-9f46-d83a0a933b40',
  });

  return tokenData.data;
}

export async function registerDevice(token: string): Promise<void> {
  if (!TAILSIGNAL_API_URL) return;

  try {
    await fetch(`${TAILSIGNAL_API_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        expo_token: token,
        device_type: process.env.EXPO_OS ?? 'unknown',
        device_model: Device.modelName ?? 'Unknown',
        os_version: Device.osVersion ?? 'Unknown',
        app_version: Constants.expoConfig?.version ?? 'Unknown',
      }),
    });
  } catch {
    // Silently fail — device registration is best-effort
  }
}

export async function unregisterDevice(token: string): Promise<void> {
  if (!TAILSIGNAL_API_URL) return;

  try {
    await fetch(
      `${TAILSIGNAL_API_URL}/register?expo_token=${encodeURIComponent(token)}`,
      { method: 'DELETE' }
    );
  } catch {
    // Silently fail — device unregistration is best-effort
  }
}

/**
 * Check if a token is registered and active on the TailSignal backend.
 * Returns true only if the device is both registered and active.
 */
export async function isDeviceRegistered(token: string): Promise<boolean> {
  if (!TAILSIGNAL_API_URL) return false;

  try {
    const response = await fetch(
      `${TAILSIGNAL_API_URL}/register/status?expo_token=${encodeURIComponent(token)}`
    );

    if (!response.ok) return false;

    const data = await response.json();
    return data.registered === true && data.active === true;
  } catch {
    // If the check fails (network error, server down), assume registered
    // to avoid spamming re-registrations when the backend is unreachable.
    return true;
  }
}
