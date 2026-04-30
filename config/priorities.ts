export const BASE_PRIORITIES = ['low', 'medium', 'high'] as const;

export type BasePrioritiesType = (typeof BASE_PRIORITIES)[number];
