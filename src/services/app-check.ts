import appCheck from '@react-native-firebase/app-check';

/**
 * Initialize Firebase App Check with native device attestation.
 * Call once at app startup (module level in root layout).
 *
 * - iOS: App Attest (primary) with DeviceCheck fallback
 * - Android: Play Integrity
 */
export function initializeAppCheck(): void {
  const provider = appCheck().newReactNativeFirebaseAppCheckProvider();
  provider.configure({
    apple: {
      provider: __DEV__ ? 'debug' : 'appAttestWithDeviceCheckFallback',
    },
    android: {
      provider: __DEV__ ? 'debug' : 'playIntegrity',
    },
  });

  appCheck().initializeAppCheck({ provider, isTokenAutoRefreshEnabled: true });
}

/**
 * Get a fresh App Check token for authenticating API requests.
 * Throws a user-friendly error if token retrieval fails.
 */
export async function getAppCheckToken(): Promise<string> {
  try {
    const { token } = await appCheck().getToken(true);
    return token;
  } catch {
    throw new Error(
      'Device verification failed. Please try again or restart the app.',
    );
  }
}
