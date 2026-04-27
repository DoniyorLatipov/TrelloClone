'use client';
import { useUser } from '@clerk/nextjs';
import { boardDataService, boardService } from '../services';
import { BoardType } from '../supabase/types';
import { useEffect, useState } from 'react';
import { useSupabase } from '../supabase/supabaseProvider';

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

  async function createBoard(boardData: { title: string; desciption?: string; color?: string }) {
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
    loadBoards,
  };
}
