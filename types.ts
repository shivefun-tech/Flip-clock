
export type ThemeId = 'dark' | 'light' | 'blue' | 'night' | 'minimal';
export type ClockSize = 'sm' | 'md' | 'lg';

export interface ThemeColors {
  bg: string;
  cardBg: string;
  text: string;
  accent: string;
  divider: string;
}

export interface AppSettings {
  is24h: boolean;
  showDate: boolean;
  showMilliseconds: boolean;
  showSeconds: boolean;
  theme: ThemeId;
  clockSize: ClockSize;
  isManual: boolean;
  manualOffset: number;
  manualDate: string;
  manualTime: string;
  vibrateEnabled: boolean;
  vibrateOnSecond: boolean;
  vibrateOnMinute: boolean;
  vibrateOnHour: boolean;
}

export type ScreenMode = 'clock' | 'countdown' | 'stopwatch';
