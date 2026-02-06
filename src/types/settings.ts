export type FontSize = 'small' | 'medium' | 'large';

export type ThemePreference = 'light' | 'dark' | 'auto';

export interface Settings {
  fontSize: FontSize;
  themePreference: ThemePreference;
}

export const DEFAULT_SETTINGS: Settings = {
  fontSize: 'medium',
  themePreference: 'auto',
};
