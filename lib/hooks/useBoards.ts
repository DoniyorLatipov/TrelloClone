'use client';
import { useUser } from '@clerk/nextjs';
import { boardDataService, boardService } from '../services';
import { BoardType, ColumnType } from '../supabase/types';
import { useEffect, useState } from 'react';
import { useSupabase } from '../supabase/supabaseProvider';
import { BaseColorType } from '@/config/color';

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

  return { board, columns, loading, error, updateBoard };
}
