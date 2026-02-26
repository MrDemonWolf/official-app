import {
  initializeAppCheck as _initializeAppCheck,
  getToken as _getToken,
} from '@react-native-firebase/app-check';

import type { AppCheck } from '@react-native-firebase/app-check';

let appCheckInstance: AppCheck | null = null;

/**
 * Initialize Firebase App Check with native device attestation.
 * Call once at app startup (module level in root layout).
 *
 * - iOS: App Attest (primary) with DeviceCheck fallback
 * - Android: Play Integrity
 */
export async function initializeAppCheck(): Promise<void> {
  appCheckInstance = await _initializeAppCheck(undefined, {
    provider: {
      providerOptions: {
        apple: {
          provider: __DEV__ ? 'debug' : 'appAttestWithDeviceCheckFallback',
        },
        android: {
          provider: __DEV__ ? 'debug' : 'playIntegrity',
        },
      },
    },
    isTokenAutoRefreshEnabled: true,
  });
}

/**
 * Get a fresh App Check token for authenticating API requests.
 * Throws a user-friendly error if token retrieval fails.
 */
export async function getAppCheckToken(): Promise<string> {
  if (!appCheckInstance) {
    throw new Error('App Check not initialized. Call initializeAppCheck() first.');
  }

  try {
    const { token } = await _getToken(appCheckInstance, true);
    return token;
  } catch {
    throw new Error(
      'Device verification failed. Please try again or restart the app.',
    );
  }
}
