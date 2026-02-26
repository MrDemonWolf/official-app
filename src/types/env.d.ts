declare global {
  namespace NodeJS {
    interface ProcessEnv {
      EXPO_PUBLIC_WORDPRESS_API_URL: string;
      EXPO_PUBLIC_APP_VARIANT: 'development' | 'preview' | 'production';
      APP_VARIANT?: 'development' | 'preview' | 'production';
      EXPO_PUBLIC_WORDPRESS_USER_ID: string;
      EXPO_PUBLIC_TAILSIGNAL_API_URL: string;
      EXPO_PUBLIC_PACKRELAY_API_URL: string;
      EXPO_PUBLIC_PACKRELAY_FORM_ID: string;
      APPLE_TEAM_ID?: string;
    }
  }
}

export {};
