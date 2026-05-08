'use client';
import { useUser } from '@clerk/nextjs';
import { boardDataService, boardService, taskService } from '../services';
import { BoardType, ColumnType, TaskType } from '../supabase/types';
import { useEffect, useState } from 'react';
import { useSupabase } from '../supabase/supabaseProvider';
import { BaseColorType } from '@/config/color';
import { CreateTaskInputType } from '../types';

export function useBoards() {
  const { user } = useUser();
  const [boards, setBoards] = useState<BoardType[]>([]);
  const [loading, setLoading] = useState(true);
  const { supabase } = useSupabase();
  const [error, setError] = useState<string | null>();

  // useEffect(loadBoards) for instant data retrieval and display
  useEffect(() => {
    if (user) {
      loadBoards();
    }
  }, [user, supabase]);

  async function loadBoards() {
    if (!user) throw new Error('User not authenticated');

    try {
      setLoading(true);
      setError(null);

      const data = await boardService.getBoards(supabase!, user.id);
      setBoards(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load boards.');
    } finally {
      setLoading(false);
    }
  }

  async function createBoard(boardData: {
    title: string;
    desciption?: string;
    color?: BaseColorType;
  }) {
    if (!user) throw new Error('User not authenticated');

    try {
      const newBoard = await boardDataService.createBoardWithDefaultColumns(supabase!, {
        ...boardData,
        userId: user?.id,
      });
      setBoards((prev) => [newBoard, ...prev]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create board.');
    }
  }

  return {
    boards,
    loading,
    error,
    createBoard,
  };
}

export function useBoard(boardId: string) {
  const { supabase } = useSupabase();
  const [board, setBoard] = useState<BoardType | null>(null);
  const [columns, setColumns] = useState<ColumnType[]>([]);
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>();

  useEffect(() => {
    if (boardId) {
      loadBoard();
    }
  }, [boardId, supabase]);

  async function loadBoard() {
    if (!boardId) throw new Error(`Can't acces board with ID: ${boardId}.`);

    try {
      setLoading(true);
      setError(null);

      const data = await boardDataService.getBoardWithColumns(supabase!, boardId);
      setBoard(data.board);
      setColumns(data.columns);
      setTasks(data.tasks);
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to load the board with ID: ${boardId}`);
    } finally {
      setLoading(false);
    }
  }

  async function updateBoard(boardId: string, updates: { color: BaseColorType; title: string }) {
    if (!boardId) throw new Error(`Can't acces board with ID: ${boardId}.`);

    try {
      setLoading(true);
      setError(null);

      const updatedBoard = await boardService.updateBoard(supabase!, boardId, updates);
      setBoard(updatedBoard);
      return updatedBoard;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : `Failed to update the board with ID: ${boardId}`,
      );
    } finally {
      setLoading(false);
    }
  }

  async function createTask(columnId: string, taskData: CreateTaskInputType) {
    if (!columnId) throw new Error(`Can't acces column with ID: ${columnId}.`);

    try {
      setLoading(true);
      setError(null);

      const newTask = await taskService.createTask(supabase!, {
        title: taskData.title,
        description: taskData.description || null,
        assignee: taskData.assignee || null,
        due_date: taskData.dueDate ? new Date(taskData.dueDate).toISOString() : null,
        column_id: columnId,
        sort_order: tasks.filter((task) => task.column_id === columnId).length || 0,
        priority: taskData.priority,
      });
      setTasks((prev) => [newTask, ...prev]);
      return newTask;
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to create the task`);
    } finally {
      setLoading(false);
    }
  }

  return { board, tasks, columns, loading, error, updateBoard, createTask, setTasks };
}
