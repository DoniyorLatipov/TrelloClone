import { BaseColorType } from '@/config/color';
import { colorClassMap } from './twColorMapper';
import { BasePrioritiesType } from '@/config/priorities';

type Variant = 'bg' | 'text';

export function getColorClass(color: BaseColorType, variant: Variant) {
  return colorClassMap[color][variant];
}

const priorityMapper: Record<BasePrioritiesType, BaseColorType> = {
  high: 'red',
  medium: 'yellow',
  low: 'green',
};

export function getPriorityColorClass(priority: BasePrioritiesType) {
  return getColorClass(priorityMapper[priority], 'bg');
}
