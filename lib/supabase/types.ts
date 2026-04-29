// ----------
// All data types for Supabase tables
// ----------

import { BaseColorType } from '@/config/color';

export interface BoardType {
  id: string;
  title: string;
  description: string | null;
  created_at: string;
  color: BaseColorType;
  user_id: string;
  updated_at: string;
}

export interface ColumnType {
  id: string;
  board_id: string;
  title: string;
  sort_order: number;
  created_at: string;
  user_id: string;
}

export interface TasksType {
  id: string;
  column_id: string;
  title: string;
  description: string | null;
  assignee: string | null;
  due_date: string | null;
  priority: 'low' | 'medium' | 'high';
  sort_order: number;
  created_at: string;
  updated_at: string;
}
