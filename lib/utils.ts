import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { CreateTaskInputType } from './types';
import { BasePrioritiesType } from '@/config/priorities';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

export function mapFormDataToCreateTaskInputType(formData: FormData): CreateTaskInputType {
  return {
    title: String(formData.get('title') || ''),
    description: String(formData.get('description') || ''),
    assignee: String(formData.get('assignee') || ''),
    priority: formData.get('priority') as BasePrioritiesType,
    dueDate: String(formData.get('dueDate') || ''),
  };
}

interface SortableItem {
  sort_order: number;
}

export function moveBySortOrder<T extends SortableItem>(
  array: T[],
  fromIndex: number,
  toIndex: number,
): T[] {
  // Create a shallow copy
  const newArray = structuredClone(array);

  // Validate indexes before processi
  if (Math.min(fromIndex, toIndex) < 0 || Math.max(fromIndex, toIndex) > array.length - 1) {
    throw new Error(
      `Index out of bounds: [${fromIndex}, ${toIndex}] for array length ${array.length}`,
    );
  }

  // No changes needed if item stays in same position
  if (fromIndex === toIndex) return newArray;

  newArray.map((el) => {
    // Move needed item to target position
    if (el.sort_order === fromIndex) {
      el.sort_order = toIndex;
      return el;
    }

    /**
     * Shift items between source and destination indexes.
     *
     * Example:
     * Moving 1 -> 3
     * ==========
     * [0, 1, 2, 3]
     *        ↓
     * [0, 2, 3, 1]
     * ==========
     *
     *
     * OR 3 -> 1
     * ==========
     * [0, 1, 2, 3]
     *        ↓
     * [0, 3, 1, 2]
     * ==========
     *
     * Items in range are shifted by ±1
     */
    if (
      el.sort_order >= Math.min(fromIndex, toIndex) &&
      el.sort_order <= Math.max(fromIndex, toIndex)
    ) {
      if (fromIndex < toIndex) {
        // Moving down: shift items left
        el.sort_order -= 1;
      } else {
        // Moving up: shift items right
        el.sort_order += 1;
      }
    }

    return el;
  });

  return newArray;
}
