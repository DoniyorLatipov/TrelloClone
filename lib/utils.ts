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
