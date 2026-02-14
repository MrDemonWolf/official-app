export type FontSize = 'small' | 'medium' | 'large';

export type ThemePreference = 'light' | 'dark' | 'auto';

export type TabName = '(index)' | '(blog)' | '(portfolio)' | '(contact)' | '(settings)';

export interface Settings {
  fontSize: FontSize;
  themePreference: ThemePreference;
  hapticsEnabled: boolean;
  lastTab: TabName;
  notificationsEnabled: boolean;
}

export const DEFAULT_SETTINGS: Settings = {
  fontSize: 'medium',
  themePreference: 'auto',
  hapticsEnabled: true,
  lastTab: '(index)',
  notificationsEnabled: false,
};
