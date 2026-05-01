import { ColumnType, TaskType } from '@/lib/supabase/types';
import React from 'react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Edit } from 'lucide-react';

interface ColumnProps extends React.PropsWithChildren {
  column: ColumnType;
  onCreateTask: (taskData: any) => Promise<void>;
  onEditColumn: (columnData: any) => Promise<void>;
  tasks: TaskType[];
}

export default function Column({ column, onCreateTask, onEditColumn, tasks }: ColumnProps) {
  return (
    <div className="w-full lg:flex-shrink-0 lg:w-80">
      <div className="bg-white rounded-lg shadow-sm border">
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

        {/* Column Content (not ready yet) */}
        <div>{tasks.map((tasks) => tasks.title)}</div>
      </div>
    </div>
  );
}
