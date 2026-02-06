import type { FontSize } from '@/types/settings';

export interface FontScale {
  body: number;
  h1: number;
  h2: number;
  h3: number;
  h4: number;
  small: number;
  code: number;
  lineHeight: number;
}

export const FONT_SCALES: Record<FontSize, FontScale> = {
  small: {
    body: 14,
    h1: 24,
    h2: 20,
    h3: 18,
    h4: 16,
    small: 12,
    code: 13,
    lineHeight: 1.5,
  },
  medium: {
    body: 17,
    h1: 28,
    h2: 24,
    h3: 20,
    h4: 18,
    small: 14,
    code: 15,
    lineHeight: 1.6,
  },
  large: {
    body: 20,
    h1: 32,
    h2: 28,
    h3: 24,
    h4: 20,
    small: 16,
    code: 18,
    lineHeight: 1.7,
  },
};
