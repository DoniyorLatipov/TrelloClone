// ----------
// All data types for Supabase tables
// ----------

import { BaseColorType } from '@/config/color';
import { BasePrioritiesType } from '@/config/priorities';

export interface BoardType {
  id: number;
  title: string;
  description: string | null;
  created_at: string;
  color: BaseColorType;
  user_id: string;
  updated_at: string;
}

export interface ColumnType {
  id: number;
  board_id: number;
  title: string;
  sort_order: number;
  created_at: string;
  user_id: string;
}

export interface TaskType {
  id: number;
  column_id: number;
  title: string;
  description: string | null;
  assignee: string | null;
  due_date: string | null;
  priority: BasePrioritiesType;
  sort_order: number;
  created_at: string;
}
