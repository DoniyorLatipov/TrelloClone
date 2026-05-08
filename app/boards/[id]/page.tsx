'use client';

import Column from '@/components/column';
import Navbar from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectItem,
  SelectValue,
  SelectContent,
  SelectTrigger,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { BASE_COLORS, BaseColorType } from '@/config/color';
import { BASE_PRIORITIES } from '@/config/priorities';
import { getColorClass } from '@/lib/getColorClass';
import { useBoard } from '@/lib/hooks/useBoards';
import { capitalize, mapFormDataToCreateTaskInputType, moveBySortOrder } from '@/lib/utils';
import { Loader2, Plus } from 'lucide-react';
import { useParams } from 'next/navigation';
import React, { useState } from 'react';
import { DragDropProvider, DragOverEvent, DragOverlay, DragStartEvent } from '@dnd-kit/react';
import { TaskType } from '@/lib/supabase/types';
import { TaskOverlay } from '@/components/task';

export default function BoardPage() {
  const { id } = useParams<{ id: string }>();
  const { board, loading, error, updateBoard, createTask, columns, tasks, setTasks } = useBoard(id);

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newColor, setNewColor] = useState<BaseColorType | ''>('');

  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [isCreatingTask, setIsCreatingTask] = useState(false);

  // Dnd handlers
  const [activeTask, setActiveTask] = useState<TaskType | null>(null);

  function handleDragStart(event: DragStartEvent) {
    const taskId = event.operation.source?.id as string;
    const draggedTask = tasks.find((task) => task.id === taskId);

    if (draggedTask) {
      setActiveTask(draggedTask);
    }
  }

  function handleDragOver(event: DragOverEvent) {
    const overId = event.operation.target?.id as string;
    const overType = event.operation.target?.type as string;

    if (overType !== 'task') return;

    const overTask = tasks.find((task) => task.id === overId);

    const sourceColumn = columns.find((column) => column.id === activeTask?.column_id);
    const targetColumn = columns.find((column) => column.id === overTask?.column_id);

    if (!sourceColumn || !targetColumn) return;

    if (sourceColumn.id === targetColumn.id) {
      const activeIndex = activeTask?.sort_order;
      const targetIndex = overTask?.sort_order;

      if (activeIndex === targetIndex || !activeIndex || !targetIndex) return;

      setTasks((prevTasks: TaskType[]) => {
        const newTasks = structuredClone(prevTasks);
        const columnTasks = newTasks.filter((task) => task.column_id === sourceColumn.id);
        const restTasks = newTasks.filter((task) => task.column_id !== sourceColumn.id);

        moveBySortOrder(columnTasks, activeIndex!, targetIndex!);
        return [...restTasks, ...columnTasks];
      });
    }
  }

  async function handleUpdateBoard(e: React.SubmitEvent) {
    e.preventDefault();

    if (!newTitle.trim() || !newColor || !board) return;

    try {
      await updateBoard(board.id, { title: newTitle, color: newColor });
    } catch (err) {
      throw err;
    }
  }

  async function handleCreateTask(e: React.SubmitEvent) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const taskData = mapFormDataToCreateTaskInputType(formData);

    if (taskData.title.trim()) {
      const targetColumn = columns[0];

      if (!targetColumn) throw new Error('No column available to add task in');

      await createTask(targetColumn.id, taskData);
      setIsCreatingTask(false);
    }
  }

  if (loading) {
    return (
      <div>
        <Loader2 />
        <span>Loading your boards...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h2>Error loading board...</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        boardTitle={board?.title}
        boardColor={board?.color}
        onEditBoard={() => {
          setNewTitle(board?.title!);
          setNewColor(board?.color!);

          setIsEditingTitle(true);
        }}
        onEditFilter={() => {
          setIsFilterOpen(true);
        }}
        // Use 2 fortesting UI
        filterCount={2}
      />

      {/* Board content */}
      <main className="container mx-auto px-2 sm:px-4 py-4 sm: py-6">
        {/* Stats bar and create task button dialog */}
        <div className="flex flex-col sm:flex-row sm:flex-row sm:item-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <div className="text-sm text-gray-600">
              <span className="font-medium">Total Tasks:</span> {tasks.length}
            </div>
          </div>

          {/* Add task dialog */}
          <Button className="w-full sm:w-auto" onClick={() => setIsCreatingTask(true)}>
            <Plus />
            Add Task
          </Button>
        </div>

        {/* Board Columns */}
        <DragDropProvider onDragStart={handleDragStart} onDragOver={handleDragOver}>
          <div className="flex flex-col lg:flex-row lg:space-x-6 lg:overflow-x-auto lg:pb-6 lg:px-2 lg:-mx-2 lg:[&::-webkit-scrollbar]:h-2 lg:[&::-webkit-scrollbar-track]:bg-gray-100 lg:[&::-webkit-thumb]:bg-gray-300 lg:[&::-webkit-scrollbar-thumb]:rounded-full space-y-4 lg:space-y-0">
            {columns.map((column) => (
              <Column
                key={column.id}
                column={column}
                onCreatingTask={() => setIsCreatingTask(true)}
                onEditColumn={() => new Promise(() => {})}
                tasks={tasks.filter((task) => task.column_id === column.id)}
              />
            ))}
          </div>
          <DragOverlay>{activeTask ? <TaskOverlay task={activeTask} /> : null}</DragOverlay>
        </DragDropProvider>
      </main>

      {/* Dialog for creating new task */}
      <Dialog open={isCreatingTask} onOpenChange={setIsCreatingTask}>
        <DialogContent className="w-[95vw] max-w-[425px] mx-auto">
          <DialogHeader>
            <DialogTitle>Create New Task</DialogTitle>
            <DialogDescription className="text-sm text-gray-600">
              Add a task to the board
            </DialogDescription>
          </DialogHeader>

          <form className="space-y-4" onSubmit={handleCreateTask}>
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                type="text"
                name="title"
                id="title"
                required
                placeholder="Enter task title..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                name="description"
                id="description"
                placeholder="Enter task description... (optional)"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="assignee">Assignee</Label>
              <Input
                type="text"
                name="assignee"
                id="assignee"
                placeholder="Who should do this task? (optional)"
              />
              <Button variant="secondary" type="button" className="text-xs">
                Assign yourself
              </Button>
            </div>
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              {/* Select defaultValue="medium" */}
              <Select name="priority" defaultValue={BASE_PRIORITIES[1]}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {BASE_PRIORITIES.map((priority) => (
                    <SelectItem key={priority} value={priority}>
                      {capitalize(priority)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <Input type="date" id="dueDate" name="dueDate" />
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsCreatingTask(false)}>
                Cancel
              </Button>
              <Button type="submit">Create Task</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog for editing title and color */}
      <Dialog open={isEditingTitle} onOpenChange={setIsEditingTitle}>
        <DialogContent className="w-[95vw] max-w-[425px] mx-auto">
          <DialogHeader>
            <DialogTitle>Edit Board</DialogTitle>
          </DialogHeader>
          <DialogContent>
            <form className="space-y-4" onSubmit={handleUpdateBoard}>
              <div className="space-y-2">
                <Label htmlFor="boardTitle">Board Title</Label>
                <Input
                  type="text"
                  id="boardTitle"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Enter board title..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="boardColor">Board Color</Label>
                <div className="grid grid-cols-4 sm: grid-cols-6 gap-2">
                  {BASE_COLORS.map((color) => (
                    <Button
                      key={color}
                      className={`w-8 h-8 rounded-full ${getColorClass(color, 'bg')} ${color === newColor ? 'ring-2 ring-offset-2 ring-gray-900' : ''}`}
                      type="button"
                      onClick={() => setNewColor(color)}
                    />
                  ))}
                </div>
              </div>
              <DialogDescription>
                <span className="text-xs text-gray-600">
                  Please note: Once saved, all previous information cannot be recovered.
                </span>
              </DialogDescription>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsEditingTitle(false)}>
                  Cancel
                </Button>
                <Button type="submit">Save Changes</Button>
              </div>
            </form>
          </DialogContent>
        </DialogContent>
      </Dialog>

      {/* Dialog for filtering tasks */}
      <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <DialogContent className="w-[95vw] max-w-[425px] mx-auto">
          <DialogHeader>
            <DialogTitle>Filter Tasks</DialogTitle>
            <DialogDescription>
              <span className="text-sm text-gray-600">
                Filter tasks by priority, assignee, or due date
              </span>
            </DialogDescription>
            <form className="space-y-4">
              <div className="space-y-2">
                <Label>Priority</Label>
                <ButtonGroup>
                  {BASE_PRIORITIES.map((priority) => (
                    <Button variant={'outline'} size="sm" key={priority} type="button">
                      {capitalize(priority)}
                    </Button>
                  ))}
                </ButtonGroup>
              </div>
              {/* <div className="space-y-2">
                <Label>Assignee</Label>
                <div className="flex flex-wrap gap-2">

                </div>
              </div> */}
              <div className="space-y-2">
                <Label>Due Date</Label>
                <Input type="date" />
              </div>

              <div className="flex justify-between pt-4">
                <Button type="button">Clear Filter</Button>
                <Button type="submit" onClick={() => setIsFilterOpen(false)}>
                  Apply Filters
                </Button>
              </div>
            </form>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
