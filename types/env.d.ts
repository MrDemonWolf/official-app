declare global {
  namespace NodeJS {
    interface ProcessEnv {
      EXPO_PUBLIC_WORDPRESS_API_URL: string;
      EXPO_PUBLIC_APP_VARIANT: 'development' | 'preview' | 'production';
      APP_VARIANT?: 'development' | 'preview' | 'production';
    }
  }
}

export {};
