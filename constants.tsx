
import { ThemeId, ThemeColors } from './types';

export const THEMES: Record<ThemeId, ThemeColors> = {
  dark: {
    bg: 'bg-[radial-gradient(circle_at_center,_#1a1a1a_0%,_#000000_100%)]',
    cardBg: 'bg-zinc-900',
    text: 'text-zinc-100',
    accent: 'bg-zinc-800',
    divider: 'bg-black/40',
  },
  light: {
    bg: 'bg-[radial-gradient(circle_at_center,_#ffffff_0%,_#d4d4d8_100%)]',
    cardBg: 'bg-white',
    text: 'text-zinc-900',
    accent: 'bg-zinc-200',
    divider: 'bg-zinc-300',
  },
  blue: {
    bg: 'bg-[radial-gradient(circle_at_center,_#1e293b_0%,_#020617_100%)]',
    cardBg: 'bg-slate-900',
    text: 'text-blue-50',
    accent: 'bg-blue-900',
    divider: 'bg-black/40',
  },
  night: {
    bg: 'bg-[radial-gradient(circle_at_center,_#2e1065_0%,_#000000_100%)]',
    cardBg: 'bg-zinc-950',
    text: 'text-purple-100',
    accent: 'bg-purple-900',
    divider: 'bg-black/60',
  },
  minimal: {
    bg: 'bg-zinc-50',
    cardBg: 'bg-white shadow-sm border border-zinc-200',
    text: 'text-zinc-900',
    accent: 'bg-zinc-100',
    divider: 'bg-zinc-200',
  },
};
