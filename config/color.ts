export const BASE_COLORS = [
  'blue',
  'green',
  'yellow',
  'red',
  'purple',
  'pink',
  'indigo',
  'gray',
  'orange',
  'teal',
  'cyan',
  'emerald',
] as const;

export type BaseColorType = (typeof BASE_COLORS)[number];
