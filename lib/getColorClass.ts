import { BaseColorType } from '@/config/color';
import { colorClassMap } from './twColorMapper';

type Variant = 'bg' | 'text';

export function getColorClass(color: BaseColorType, variant: Variant) {
  return colorClassMap[color][variant];
}
