'use client';

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
import { BASE_COLORS, BaseColorType } from '@/config/color';
import { BASE_PRIORITIES } from '@/config/priorities';
import { getColorClass } from '@/lib/getColorCLass';
import { useBoard } from '@/lib/hooks/useBoards';
import { capitalize } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useState } from 'react';

export default function BoardPage() {
  const { id } = useParams<{ id: string }>();
  const { board, loading, error, updateBoard } = useBoard(id);

  console.log(board);

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newColor, setNewColor] = useState<BaseColorType | ''>('');

  const [isFilterOpen, setIsFilterOpen] = useState(false);

  async function handleUpdateBoard(e: React.SubmitEvent) {
    e.preventDefault();

    if (!newTitle.trim() || !newColor || !board) return;

    try {
      await updateBoard(board.id, { title: newTitle, color: newColor });
    } catch (err) {
      throw err;
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
