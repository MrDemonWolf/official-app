declare global {
  namespace NodeJS {
    interface ProcessEnv {
      EXPO_PUBLIC_WORDPRESS_API_URL: string;
      EXPO_PUBLIC_APP_VARIANT: 'development' | 'preview' | 'production';
      APP_VARIANT?: 'development' | 'preview' | 'production';
      EXPO_PUBLIC_GF_API_URL: string;
      EXPO_PUBLIC_GF_CONTACT_FORM_ID: string;
    }
  }
}

export {};
