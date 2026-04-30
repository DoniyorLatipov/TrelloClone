import { BaseColorType } from '@/config/color';

type Variant = 'bg' | 'text';

export const colorClassMap: Record<BaseColorType, Record<Variant, string>> = {
  blue: {
    bg: 'bg-blue-500',
    text: 'text-blue-500',
  },
  green: {
    bg: 'bg-green-500',
    text: 'text-green-500',
  },
  yellow: {
    bg: 'bg-yellow-500',
    text: 'text-yellow-500',
  },
  red: {
    bg: 'bg-red-500',
    text: 'text-red-500',
  },
  purple: {
    bg: 'bg-purple-500',
    text: 'text-purple-500',
  },
  pink: {
    bg: 'bg-pink-500',
    text: 'text-pink-500',
  },
  indigo: {
    bg: 'bg-indigo-500',
    text: 'text-indigo-500',
  },
  gray: {
    bg: 'bg-gray-500',
    text: 'text-gray-500',
  },
  orange: {
    bg: 'bg-orange-500',
    text: 'text-orange-500',
  },
  teal: {
    bg: 'bg-teal-500',
    text: 'text-teal-500',
  },
  cyan: {
    bg: 'bg-cyan-500',
    text: 'text-cyan-500',
  },
  emerald: {
    bg: 'bg-emerald-500',
    text: 'text-emerald-500',
  },
};
