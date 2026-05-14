import { TaskType } from '@/lib/supabase/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { CalendarDays, UserCircle2 } from 'lucide-react';
import { getPriorityColorClass } from '@/lib/getColorClass';
import { useSortable } from '@dnd-kit/react/sortable';

interface TaskProps {
  task: TaskType;
  group: string;
  index: number;
}

export default function Task({ task, index, group }: TaskProps) {
  const { ref, isDragging } = useSortable({
    id: String(task.id),
    index,
    type: 'task',
    accept: 'task',
    group,
  });

  return (
    <Card
      ref={ref}
      data-dragging={isDragging}
      className={`cursor-pointer hover:shadow-md transition-shadow ${isDragging ? 'opacity-50' : ''}`}
    >
      <CardContent className="p-3 sm:p-4 space-y-2 sm:space-y-3">
        <CardHeader className="p-0 flex items-start justify-between">
          <CardTitle>
            <h4 className="font-medium text-gray-900 text-sm leading-tight flex-1 min-w-0 pr-2">
              {task.title}
            </h4>
          </CardTitle>
        </CardHeader>
        {/* Task Description */}
        <CardDescription>
          <p className="text-xs text-gray-600 line-clamp-2">
            {task.description || 'No description.'}
          </p>
        </CardDescription>

        {/* Task Meta */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1 sm:space-x-2 min-w-0">
            {task.assignee && (
              <div className="flex items-center space-x-1 text-xs text-gray-500">
                <UserCircle2 className="h-4 w-4" />
                <span className="truncate">{task.assignee}</span>
              </div>
            )}

            {task.due_date && (
              <div className="flex items-center space-x-1 text-xs text-gray-500">
                <CalendarDays className="h-4 w-4" />
                <span className="truncate">{new Date(task.due_date).toLocaleDateString()}</span>
              </div>
            )}
          </div>

          <div
            className={`w-2 h-2 rounded flex-shrink-0 ${getPriorityColorClass(task.priority)}`}
          />
        </div>
      </CardContent>
    </Card>
  );
}

export function TaskOverlay({ task }: Omit<TaskProps, 'group' | 'index'>) {
  return (
    <Card className="cursor-pointer hover:shadow-md transition-shadow">
      <CardContent className="p-3 sm:p-4 space-y-2 sm:space-y-3">
        <CardHeader className="p-0 flex items-start justify-between">
          <CardTitle>
            <h4 className="font-medium text-gray-900 text-sm leading-tight flex-1 min-w-0 pr-2">
              {task.title}
            </h4>
          </CardTitle>
        </CardHeader>
        {/* Task Description */}
        <CardDescription>
          <p className="text-xs text-gray-600 line-clamp-2">
            {task.description || 'No description.'}
          </p>
        </CardDescription>

        {/* Task Meta */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1 sm:space-x-2 min-w-0">
            {task.assignee && (
              <div className="flex items-center space-x-1 text-xs text-gray-500">
                <UserCircle2 className="h-4 w-4" />
                <span className="truncate">{task.assignee}</span>
              </div>
            )}

            {task.due_date && (
              <div className="flex items-center space-x-1 text-xs text-gray-500">
                <CalendarDays className="h-4 w-4" />
                <span className="truncate">{new Date(task.due_date).toLocaleDateString()}</span>
              </div>
            )}
          </div>

          <div
            className={`w-2 h-2 rounded flex-shrink-0 ${getPriorityColorClass(task.priority)}`}
          />
        </div>
      </CardContent>
    </Card>
  );
}
