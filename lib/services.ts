import { BaseColorType } from '@/config/color';
import { BoardType, ColumnType } from './supabase/types';
import { SupabaseClient } from '@supabase/supabase-js';

// ----------
// All interface related to Supabase
// ----------

export const boardService = {
  async getBoard(supabase: SupabaseClient, boardId: string): Promise<BoardType> {
    const { data, error } = await supabase.from('boards').select('*').eq('id', boardId).single();

    if (error) throw error;

    return data;
  },
  async getBoards(supabase: SupabaseClient, userId: string): Promise<BoardType[]> {
    const { data, error } = await supabase
      .from('boards')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data || [];
  },
  async createBoard(
    supabase: SupabaseClient,
    board: Omit<BoardType, 'id' | 'created_at' | 'updated_at'>,
  ): Promise<BoardType> {
    const { data, error } = await supabase.from('boards').insert(board).select().single();

    if (error) throw error;

    console.log(data);

    return data;
  },
  async updateBoard(
    supabase: SupabaseClient,
    boardId: string,
    updates: {
      title: string;
      color: BaseColorType;
    },
  ) {
    const { data, error } = await supabase
      .from('boards')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', boardId)
      .select()
      .single();

    if (error) throw error;

    return data;
  },
};

export const columnService = {
  async getColumns(supabase: SupabaseClient, boardId: string): Promise<ColumnType[]> {
    const { data, error } = await supabase
      .from('columns')
      .select('*')
      .eq('board_id', boardId)
      .order('sort_order', { ascending: true });

    if (error) throw error;

    return data || [];
  },
  async createColumn(
    supabase: SupabaseClient,
    column: Omit<ColumnType, 'id' | 'created_at'>,
  ): Promise<ColumnType> {
    const { data, error } = await supabase.from('columns').insert(column).select().single();

    if (error) throw error;

    return data;
  },
};

export const boardDataService = {
  async createBoardWithDefaultColumns(
    supabase: SupabaseClient,
    boardData: {
      title: string;
      desciption?: string;
      color?: BaseColorType;
      userId: string;
    },
  ) {
    const board = await boardService.createBoard(supabase, {
      title: boardData.title,
      description: boardData.desciption || null,
      color: boardData.color || 'blue',
      user_id: boardData.userId,
    });

    const defaultColumns = [
      {
        title: 'To Do',
        sort_order: 0,
      },
      {
        title: 'In Progress',
        sort_order: 1,
      },
      {
        title: 'In Review',
        sort_order: 2,
      },
      {
        title: 'Done',
        sort_order: 3,
      },
    ];

    await Promise.all(
      defaultColumns.map((column) =>
        columnService.createColumn(supabase, {
          ...column,
          board_id: board.id,
          user_id: boardData.userId,
        }),
      ),
    );

    return board;
  },

  // Precisely because the function will be accessing the table both of boards and their tasks, it is better to place this func in the boardData Service
  async getBoardWithColumns(supabase: SupabaseClient, boardId: string) {
    const [board, columns] = await Promise.all([
      boardService.getBoard(supabase, boardId),
      columnService.getColumns(supabase, boardId),
    ]);

    if (!board) throw new Error('Board not found');

    return { board, columns };
  },
};
