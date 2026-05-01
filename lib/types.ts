import { BasePrioritiesType } from '@/config/priorities';

// ----------
// DTO (Data Transfer Object) types
// ----------

export type CreateTaskInputType = {
  title: string;
  description?: string;
  assignee?: string;
  priority: BasePrioritiesType;
  dueDate?: string;
};
