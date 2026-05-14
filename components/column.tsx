import { ColumnType, TaskType } from '@/lib/supabase/types';
import React from 'react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Edit, Plus } from 'lucide-react';
import Task from './task';
import { CollisionPriority } from '@dnd-kit/abstract';
import { useDroppable } from '@dnd-kit/react';

interface ColumnProps extends React.PropsWithChildren {
  column: ColumnType;
  onCreatingTask: () => void;
  onEditColumn: (columnData: any) => Promise<void>;
  tasks: TaskType[];
}

export default function Column({ column, onCreatingTask, onEditColumn, tasks }: ColumnProps) {
  const { isDropTarget, ref } = useDroppable({
    id: String(column.id),
    type: 'column',
    accept: 'task',
    collisionPriority: CollisionPriority.Low,
  });

  return (
    <div className="w-full lg:flex-shrink-0 lg:w-80" ref={ref}>
      <div
        //  ${isDragging ? 'opacity-70' : ''}
        className={`rounded-lg shadow-sm border bg-white ${isDropTarget ? 'border border-blue-300' : ''}`}
      >
        {/* Column Header */}
        <div className="p-3 sm:p-4 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 min-w-0">
              <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                {column.title}
              </h3>
              <Badge variant="secondary" className="text-xs flex-shrink-0">
                {tasks.length}
              </Badge>
            </div>
            <Button variant="ghost" size="sm" className="flex-shrink-0">
              <Edit />
            </Button>
          </div>
        </div>

        {/* Column Content */}
        <div className="space-y-3 p-2">
          {tasks.map((task, index) => (
            <Task index={index} group={String(column.id)} task={task} key={task.id} />
          ))}
          <Button
            variant="ghost"
            className="w-full p-2 text-gray-500 hover:text-gray-700"
            onClick={() => onCreatingTask()}
          >
            <Plus />
            Add Task
          </Button>
        </div>
      </div>
    </div>
  );
}
